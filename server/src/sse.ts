import { Response } from 'express';

interface SSEClient {
  ref: string;
  res: Response;
  keepAliveTimer: NodeJS.Timeout;
}

const clients: SSEClient[] = [];

export function addSSEClient(ref: string, res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send initial ping to establish connection
  res.write(`event: connected\ndata: ${JSON.stringify({ ref, timestamp: Date.now() })}\n\n`);

  // Heartbeat ping every 15 seconds to prevent network drop
  const keepAliveTimer = setInterval(() => {
    res.write(': ping\n\n');
  }, 15000);

  const client: SSEClient = { ref, res, keepAliveTimer };
  clients.push(client);

  res.on('close', () => {
    clearInterval(keepAliveTimer);
    const index = clients.indexOf(client);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
}

export function broadcastStatusUpdate(ref: string, status: string, updatedAt: string) {
  const payload = JSON.stringify({ ref, status, updatedAt });
  for (const client of clients) {
    if (client.ref === ref) {
      client.res.write(`event: status_update\ndata: ${payload}\n\n`);
    }
  }
}
