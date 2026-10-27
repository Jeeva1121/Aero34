import { Router } from 'express';
import { db } from '../db.js';
import { CreateRequestSchema } from '../../../shared/schemas.js';
import { generateRef } from '../auth.js';
import { addSSEClient } from '../sse.js';
import { queueEmail } from '../email.js';

export const requestsRouter = Router();

// In-memory rate limiter for status lookups to prevent ref enumeration
const lookupRateMap = new Map<string, { count: number; resetAt: number }>();
function checkLookupRate(ip: string): boolean {
  const now = Date.now();
  const entry = lookupRateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    lookupRateMap.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (entry.count >= 30) {
    return false; // Max 30 lookups per minute per IP
  }
  entry.count += 1;
  return true;
}

// POST /api/requests
requestsRouter.post('/', (req, res) => {
  const parsed = CreateRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid request data',
      details: parsed.error.issues.map(i => i.message),
    });
  }

  const data = parsed.data;

  // Honeypot bot protection
  if (data.honeypot && data.honeypot.length > 0) {
    return res.status(400).json({ error: 'Request rejected' });
  }

  // Idempotency check: if already submitted, return the existing request
  const existing = db.prepare(`
    SELECT ref, status, created_at FROM requests WHERE idempotency_key = ?
  `).get(data.idempotencyKey) as { ref: string; status: string; created_at: string } | undefined;

  if (existing) {
    return res.status(200).json({
      ref: existing.ref,
      status: existing.status,
      idempotent: true,
    });
  }

  // Atomic seat reservation inside SQLite transaction
  let ref = '';
  try {
    const transaction = db.transaction(() => {
      // 1. Verify route existence
      const route = db.prepare('SELECT id, origin_city, dest_city, total_seats FROM routes WHERE id = ?').get(data.routeId) as any;
      if (!route) {
        throw new Error('ROUTE_NOT_FOUND');
      }

      // 2. Check and atomically decrement seats for the requested date
      const monthStr = data.dates.slice(0, 7);
      let avail = db.prepare(`
        SELECT id, seats_left FROM availability WHERE route_id = ? AND date = ?
      `).get(data.routeId, data.dates) as { id: number; seats_left: number } | undefined;

      if (!avail) {
        // Create availability record if date within 90 days
        db.prepare(`
          INSERT INTO availability (route_id, date, month, seats_left, total_seats)
          VALUES (?, ?, ?, ?, ?)
        `).run(data.routeId, data.dates, monthStr, route.total_seats, route.total_seats);
        avail = { id: 0, seats_left: route.total_seats };
      }

      if (avail.seats_left < data.partySize) {
        throw new Error('INSUFFICIENT_SEATS');
      }

      // Atomically decrement seats
      db.prepare(`
        UPDATE availability
        SET seats_left = seats_left - ?
        WHERE route_id = ? AND date = ?
      `).run(data.partySize, data.routeId, data.dates);

      // 3. Generate unguessable reference AR-XXXXX
      ref = generateRef();

      // 4. Insert request
      db.prepare(`
        INSERT INTO requests (
          ref, route_id, name, email, dates, party_size, note, status, idempotency_key
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Received', ?)
      `).run(
        ref,
        data.routeId,
        data.name,
        data.email,
        data.dates,
        data.partySize,
        data.note || '',
        data.idempotencyKey
      );

      // 5. Queue transactional confirmation email
      queueEmail({
        toEmail: data.email,
        subject: `AERO 34 Seat Request Confirmation [${ref}]`,
        body: `Dear ${data.name},\n\nYour charter seat request on ${route.origin_city} to ${route.dest_city} for party of ${data.partySize} on ${data.dates} has been received.\n\nReference: ${ref}\n\nTrack status live at https://aero34.com/request?ref=${ref}\n\nAero 34 Operations`,
      });
    });

    transaction();

    return res.status(201).json({
      ref,
      status: 'Received',
      message: 'Charter seat request logged successfully',
    });
  } catch (err: any) {
    if (err.message === 'INSUFFICIENT_SEATS') {
      return res.status(409).json({ error: 'Requested party size exceeds remaining seats on selected date' });
    }
    if (err.message === 'ROUTE_NOT_FOUND') {
      return res.status(404).json({ error: 'Selected route does not exist' });
    }
    return res.status(500).json({ error: 'Failed to process request safely' });
  }
});

// GET /api/requests/:ref/status
// Security: Never returns personal details (name, email, note). Only status and route info.
requestsRouter.get('/:ref/status', (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkLookupRate(ip)) {
    return res.status(429).json({ error: 'Too many status inquiries. Please wait 1 minute.' });
  }

  const ref = req.params.ref.toUpperCase().trim();
  const row = db.prepare(`
    SELECT r.ref, r.status, r.dates, r.party_size, r.created_at, r.updated_at,
           rt.origin_city, rt.origin_code, rt.dest_city, rt.dest_code, rt.aircraft
    FROM requests r
    JOIN routes rt ON r.route_id = rt.id
    WHERE r.ref = ?
  `).get(ref) as any;

  if (!row) {
    return res.status(404).json({ error: 'Reference not found' });
  }

  res.json({
    ref: row.ref,
    status: row.status,
    originCity: row.origin_city,
    originCode: row.origin_code,
    destCity: row.dest_city,
    destCode: row.dest_code,
    aircraft: row.aircraft,
    dates: row.dates,
    partySize: row.party_size,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
});

// GET /api/requests/:ref/stream (SSE for live tracking)
requestsRouter.get('/:ref/stream', (req, res) => {
  const ref = req.params.ref.toUpperCase().trim();
  addSSEClient(ref, res);
});
