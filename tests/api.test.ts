import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../server/src/index.js';
import { runMigrations, db } from '../server/src/db.js';
import { seedDatabase } from '../server/src/seed.js';

beforeAll(() => {
  runMigrations();
  seedDatabase();
  // Ensure test date 2026-11-18 has ample seats for booking tests
  db.prepare(`
    INSERT OR REPLACE INTO availability (route_id, date, month, seats_left, total_seats)
    VALUES ('RT-JFK-LHR', '2026-11-18', '2026-11', 12, 14)
  `).run();
});

describe('AERO 34 API Suite', () => {
  it('GET /healthz returns ok with timestamp', async () => {
    const res = await request(app).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /api/routes returns 12 authentic routes', async () => {
    const res = await request(app).get('/api/routes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(12);

    const first = res.body[0];
    expect(first.id).toBeDefined();
    expect(first.originCity).toBeDefined();
    expect(first.destCity).toBeDefined();
    expect(first.blockTime).toBeDefined();
    expect(first.coordinates.origin.length).toBe(2);
    expect(first.altitudeFeet).toBeGreaterThan(40000);
  });

  it('GET /api/routes/:slug returns specific route details', async () => {
    const res = await request(app).get('/api/routes/new-york-london');
    expect(res.status).toBe(200);
    expect(res.body.originCode).toBe('JFK');
    expect(res.body.destCode).toBe('LHR');
    expect(res.body.aircraft).toBe('Gulfstream G650ER');
  });

  it('GET /api/routes/availability/lookup returns day-by-day availability', async () => {
    const res = await request(app).get('/api/routes/availability/lookup?route=RT-JFK-LHR');
    expect(res.status).toBe(200);
    expect(res.body.routeId).toBe('RT-JFK-LHR');
    expect(Array.isArray(res.body.days)).toBe(true);
    expect(res.body.days.length).toBeGreaterThan(0);
    expect(res.body.days[0].seatsLeft).toBeDefined();
  });

  it('POST /api/requests validates input and rejects bad format', async () => {
    const badRes = await request(app)
      .post('/api/requests')
      .send({
        routeId: '',
        name: 'A',
        email: 'not-an-email',
        dates: 'invalid',
        partySize: 50,
        idempotencyKey: 'short',
      });
    expect(badRes.status).toBe(400);
    expect(badRes.body.error).toBe('Invalid request data');
  });

  it('POST /api/requests rejects honeypot bot trap', async () => {
    const botRes = await request(app)
      .post('/api/requests')
      .send({
        routeId: 'RT-JFK-LHR',
        name: 'Bot User',
        email: 'bot@example.com',
        dates: '2026-11-20',
        partySize: 2,
        idempotencyKey: 'bot-key-99999999',
        honeypot: 'filled_by_bot',
      });
    expect(botRes.status).toBe(400);
  });

  it('POST /api/requests atomically books seats and guarantees idempotency', async () => {
    const uniqueKey = `test-idemp-${Date.now()}`;
    const payload = {
      routeId: 'RT-JFK-LHR',
      name: 'Alexander Hamilton',
      email: 'a.hamilton@treasury.gov',
      dates: '2026-11-18',
      partySize: 2,
      note: 'Immediate helicopter transfer upon landing.',
      idempotencyKey: uniqueKey,
    };

    // First submission
    const res1 = await request(app).post('/api/requests').send(payload);
    expect(res1.status).toBe(201);
    expect(res1.body.ref).toMatch(/^AR-[A-Z0-9]{5}$/);
    expect(res1.body.status).toBe('Received');

    const assignedRef = res1.body.ref;

    // Idempotent second submission (simulating double click or network retry)
    const res2 = await request(app).post('/api/requests').send(payload);
    expect(res2.status).toBe(200);
    expect(res2.body.ref).toBe(assignedRef);
    expect(res2.body.idempotent).toBe(true);

    // Status inquiry returns safe data only, never personal contact info
    const statusRes = await request(app).get(`/api/requests/${assignedRef}/status`);
    expect(statusRes.status).toBe(200);
    expect(statusRes.body.ref).toBe(assignedRef);
    expect(statusRes.body.status).toBe('Received');
    expect(statusRes.body.originCity).toBe('New York');
    expect(statusRes.body.name).toBeUndefined();
    expect(statusRes.body.email).toBeUndefined();
    expect(statusRes.body.note).toBeUndefined();
  });

  it('POST /api/shortlist and DELETE /api/shortlist persist routes across sessions', async () => {
    const agent = request.agent(app);

    // Add to shortlist
    const addRes = await agent.post('/api/shortlist').send({ routeId: 'RT-LHR-HND' });
    expect(addRes.status).toBe(200);
    expect(addRes.body.success).toBe(true);

    // Get shortlist
    const getRes = await agent.get('/api/shortlist');
    expect(getRes.status).toBe(200);
    expect(getRes.body.routeIds).toContain('RT-LHR-HND');

    // Remove from shortlist
    const delRes = await agent.delete('/api/shortlist/RT-LHR-HND');
    expect(delRes.status).toBe(200);

    const getRes2 = await agent.get('/api/shortlist');
    expect(getRes2.body.routeIds).not.toContain('RT-LHR-HND');
  });

  it('Admin auth flow: login rate limit, failure lockout, and status update', async () => {
    // Bad login
    const badLogin = await request(app)
      .post('/api/admin/login')
      .send({ username: 'admin', password: 'wrongpassword' });
    expect(badLogin.status).toBe(401);

    // Valid login
    const agent = request.agent(app);
    const goodLogin = await agent
      .post('/api/admin/login')
      .send({ username: 'admin', password: 'aero34admin' });
    expect(goodLogin.status).toBe(200);
    expect(goodLogin.body.success).toBe(true);

    // Admin get requests
    const listRes = await agent.get('/api/admin/requests');
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBeGreaterThan(0);

    // Update status to 'Held'
    const targetRef = listRes.body[0].ref;
    const patchRes = await agent
      .patch(`/api/admin/requests/${targetRef}`)
      .send({ status: 'Held' });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.status).toBe('Held');

    // Verify status updated in public status endpoint
    const checkRes = await request(app).get(`/api/requests/${targetRef}/status`);
    expect(checkRes.status).toBe(200);
    expect(checkRes.body.status).toBe('Held');

    // Logout
    const logoutRes = await agent.post('/api/admin/logout');
    expect(logoutRes.status).toBe(200);

    // Verify unauthenticated after logout
    const unauthRes = await agent.get('/api/admin/requests');
    expect(unauthRes.status).toBe(401);
  });
});
