import { Router } from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { ShortlistToggleSchema } from '../../../shared/schemas.js';

export const shortlistRouter = Router();

// Middleware to establish persistent anonymous session ID for shortlist
function getSessionId(req: any, res: any): string {
  let sessionId = req.cookies?.aero34_session;
  if (!sessionId) {
    sessionId = crypto.randomBytes(16).toString('hex');
    res.cookie('aero34_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    });
  }
  return sessionId;
}

// GET /api/shortlist
shortlistRouter.get('/', (req, res) => {
  const sessionId = getSessionId(req, res);
  const rows = db.prepare(`
    SELECT route_id FROM shortlist WHERE session_id = ? ORDER BY created_at DESC
  `).all(sessionId) as Array<{ route_id: string }>;

  res.json({
    routeIds: rows.map(r => r.route_id),
  });
});

// POST /api/shortlist
shortlistRouter.post('/', (req, res) => {
  const sessionId = getSessionId(req, res);
  const parsed = ShortlistToggleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Valid routeId is required' });
  }

  try {
    db.prepare(`
      INSERT OR IGNORE INTO shortlist (session_id, route_id) VALUES (?, ?)
    `).run(sessionId, parsed.data.routeId);

    const count = (db.prepare('SELECT COUNT(*) as count FROM shortlist WHERE session_id = ?').get(sessionId) as any).count;
    res.json({ success: true, count, routeId: parsed.data.routeId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update shortlist' });
  }
});

// DELETE /api/shortlist/:routeId
shortlistRouter.delete('/:routeId', (req, res) => {
  const sessionId = getSessionId(req, res);
  const routeId = req.params.routeId;

  db.prepare(`
    DELETE FROM shortlist WHERE session_id = ? AND route_id = ?
  `).run(sessionId, routeId);

  const count = (db.prepare('SELECT COUNT(*) as count FROM shortlist WHERE session_id = ?').get(sessionId) as any).count;
  res.json({ success: true, count, routeId });
});
