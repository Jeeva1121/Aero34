import { db } from './db.js';

interface EmailJob {
  toEmail: string;
  subject: string;
  body: string;
}

export function queueEmail(job: EmailJob) {
  try {
    db.prepare(`
      INSERT INTO email_queue (to_email, subject, body, status, retries)
      VALUES (?, ?, ?, 'queued', 0)
    `).run(job.toEmail, job.subject, job.body);
  } catch (err) {
    // Non-blocking error handling
  }
}

// Background email queue processor with retries
let isProcessing = false;

export async function processEmailQueue() {
  if (isProcessing) return;
  isProcessing = true;

  try {
    const pending = db.prepare(`
      SELECT id, to_email, subject, body, retries
      FROM email_queue
      WHERE status = 'queued' AND retries < 3
      ORDER BY id ASC
      LIMIT 10
    `).all() as Array<{ id: number; to_email: string; subject: string; body: string; retries: number }>;

    for (const email of pending) {
      try {
        // Transactional delivery dispatch: Resend / Postmark integration or safe mocked dispatch
        if (process.env.RESEND_API_KEY) {
          // If Resend API key configured, make outbound call with timeout
          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: process.env.EMAIL_FROM || 'concierge@aero34.com',
              to: email.to_email,
              subject: email.subject,
              text: email.body,
            }),
            signal: AbortSignal.timeout(5000),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
        }

        db.prepare(`
          UPDATE email_queue
          SET status = 'sent', sent_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(email.id);
      } catch (err) {
        db.prepare(`
          UPDATE email_queue
          SET retries = retries + 1,
              status = CASE WHEN retries + 1 >= 3 THEN 'failed' ELSE 'queued' END
          WHERE id = ?
        `).run(email.id);
      }
    }
  } finally {
    isProcessing = false;
  }
}

const queueTimer = setInterval(() => {
  processEmailQueue().catch(() => {});
}, 10000);
if (queueTimer && typeof queueTimer.unref === 'function') {
  queueTimer.unref();
}
