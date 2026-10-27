import crypto from 'node:crypto';
import { db } from './db.js';

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const check = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(check, 'hex'), Buffer.from(hash, 'hex'));
}

export function generateRef(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  const bytes = crypto.randomBytes(5);
  for (let i = 0; i < 5; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return `AR-${code}`;
}

// Lockout tracker: 5 failed attempts locks user/IP for 15 minutes
interface FailedAttempt {
  count: number;
  lockedUntil: number;
}
const failedAttempts = new Map<string, FailedAttempt>();

export function checkLockout(identifier: string): boolean {
  const attempt = failedAttempts.get(identifier);
  if (!attempt) return false;
  if (Date.now() < attempt.lockedUntil) return true;
  if (Date.now() >= attempt.lockedUntil && attempt.lockedUntil > 0) {
    failedAttempts.delete(identifier);
  }
  return false;
}

export function recordFailedLogin(identifier: string): void {
  const attempt = failedAttempts.get(identifier) || { count: 0, lockedUntil: 0 };
  attempt.count += 1;
  if (attempt.count >= 5) {
    attempt.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 mins
  }
  failedAttempts.set(identifier, attempt);
}

export function resetFailedLogin(identifier: string): void {
  failedAttempts.delete(identifier);
}

export function createSession(adminId: number): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
  db.prepare('INSERT INTO sessions (token, admin_id, expires_at) VALUES (?, ?, ?)').run(token, adminId, expiresAt);
  return token;
}

export function validateSession(token: string): { adminId: number } | null {
  if (!token) return null;
  const row = db.prepare('SELECT admin_id, expires_at FROM sessions WHERE token = ?').get(token) as { admin_id: number; expires_at: string } | undefined;
  if (!row) return null;

  if (new Date(row.expires_at).getTime() < Date.now()) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    return null;
  }
  return { adminId: row.admin_id };
}

export function deleteSession(token: string): void {
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
}
