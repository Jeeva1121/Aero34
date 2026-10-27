import { Router } from 'express';
import { db } from '../db.js';
import { AdminLoginSchema, UpdateStatusSchema } from '../../../shared/schemas.js';
import {
  checkLockout,
  recordFailedLogin,
  resetFailedLogin,
  verifyPassword,
  createSession,
  validateSession,
  deleteSession,
} from '../auth.js';
import { broadcastStatusUpdate } from '../sse.js';
import { queueEmail } from '../email.js';

export const adminRouter = Router();

// Middleware to authenticate admin session
export function requireAdmin(req: any, res: any, next: any) {
  const token = req.cookies?.aero34_admin_token || req.headers['authorization']?.replace('Bearer ', '');
  const session = validateSession(token);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized admin access' });
  }
  req.adminId = session.adminId;
  next();
}

// POST /api/admin/login
adminRouter.post('/login', (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const lockKey = `${ip}_${req.body.username || ''}`;

  if (checkLockout(lockKey)) {
    return res.status(429).json({ error: 'Account locked due to 5 failed attempts. Please retry in 15 minutes.' });
  }

  const parsed = AdminLoginSchema.safeParse(req.body);
  if (!parsed.success) {
    recordFailedLogin(lockKey);
    return res.status(400).json({ error: 'Invalid credentials format' });
  }

  const { username, password } = parsed.data;
  const admin = db.prepare('SELECT id, password_hash, salt FROM admins WHERE username = ?').get(username) as { id: number; password_hash: string; salt: string } | undefined;

  if (!admin || !verifyPassword(password, admin.password_hash, admin.salt)) {
    recordFailedLogin(lockKey);
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  resetFailedLogin(lockKey);
  const token = createSession(admin.id);

  res.cookie('aero34_admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    token,
    username,
  });
});

// POST /api/admin/logout
adminRouter.post('/logout', (req, res) => {
  const token = req.cookies?.aero34_admin_token || req.headers['authorization']?.replace('Bearer ', '');
  if (token) {
    deleteSession(token);
  }
  res.clearCookie('aero34_admin_token');
  res.json({ success: true });
});

// GET /api/admin/me
adminRouter.get('/me', requireAdmin, (req: any, res) => {
  res.json({ authenticated: true, adminId: req.adminId });
});

// GET /api/admin/requests
adminRouter.get('/requests', requireAdmin, (req, res) => {
  const status = req.query.status as string;
  let query = `
    SELECT r.ref, r.route_id, r.name, r.email, r.dates, r.party_size, r.note,
           r.status, r.created_at, r.updated_at,
           rt.origin_city, rt.origin_code, rt.dest_city, rt.dest_code, rt.aircraft
    FROM requests r
    JOIN routes rt ON r.route_id = rt.id
  `;
  const params: any[] = [];

  if (status && status !== 'all') {
    query += ' WHERE r.status = ?';
    params.push(status);
  }

  query += ' ORDER BY r.created_at DESC';

  const rows = db.prepare(query).all(...params) as any[];

  res.json(rows.map(r => ({
    ref: r.ref,
    routeId: r.route_id,
    routeTitle: `${r.origin_city} (${r.origin_code}) → ${r.dest_city} (${r.dest_code})`,
    name: r.name,
    email: r.email,
    dates: r.dates,
    partySize: r.party_size,
    note: r.note,
    status: r.status,
    aircraft: r.aircraft,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  })));
});

// PATCH /api/admin/requests/:ref
adminRouter.patch('/requests/:ref', requireAdmin, (req, res) => {
  const ref = req.params.ref.toUpperCase().trim();
  const parsed = UpdateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Valid status is required' });
  }

  const existing = db.prepare('SELECT ref, email, name, status FROM requests WHERE ref = ?').get(ref) as { ref: string; email: string; name: string; status: string } | undefined;
  if (!existing) {
    return res.status(404).json({ error: 'Request not found' });
  }

  const newStatus = parsed.data.status;
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE requests
    SET status = ?, updated_at = ?
    WHERE ref = ?
  `).run(newStatus, now, ref);

  // Broadcast to all active SSE listeners (e.g. status tracking page)
  broadcastStatusUpdate(ref, newStatus, now);

  // Queue status change email notification
  queueEmail({
    toEmail: existing.email,
    subject: `AERO 34 Seat Request Status Updated: ${newStatus} [${ref}]`,
    body: `Dear ${existing.name},\n\nThe status of your request (${ref}) has been updated to: ${newStatus}.\n\nView live status at https://aero34.com/request?ref=${ref}\n\nAero 34 Operations`,
  });

  res.json({
    success: true,
    ref,
    status: newStatus,
    updatedAt: now,
  });
});
