import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import crypto from 'node:crypto';
import { runMigrations } from './db.js';
import { seedDatabase } from './seed.js';
import { routesRouter } from './routes/routes.js';
import { requestsRouter } from './routes/requests.js';
import { shortlistRouter } from './routes/shortlist.js';
import { adminRouter } from './routes/admin.js';

export const app = express();

// Trust proxy for reverse proxies
app.set('trust proxy', 1);

// Security Headers via Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // unsafe-inline in dev only; production bundles hashed
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'", "http://localhost:*", "ws://localhost:*"],
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xContentTypeOptions: true,
  xDnsPrefetchControl: { allow: false },
  xFrameOptions: { action: 'deny' },
}));

// Permissions-Policy denying invasive APIs
app.use((_req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  next();
});

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://aero34.com',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true,
}));

// Body parsing with strict 10kb limit to prevent payload attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Request ID attachment for tracing
app.use((req: any, res, next) => {
  req.id = crypto.randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Health check endpoint
app.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount modular API routers
app.use('/api/routes', routesRouter);
app.use('/api/requests', requestsRouter);
app.use('/api/shortlist', shortlistRouter);
app.use('/api/admin', adminRouter);

// Centralized error handler - logs full error with request ID, returns safe generic message
app.use((err: any, req: any, res: Response, _next: NextFunction) => {
  const reqId = req.id || 'unknown';
  // Centralized safe logging with requestId
  process.stderr.write(`[ERROR][${reqId}] ${req.method} ${req.url}: ${err.message || err}\n`);

  // Never expose raw stack traces or database errors to client
  res.status(err.status || 500).json({
    error: 'An internal error occurred. Please contact dispatch if this persists.',
    requestId: reqId,
  });
});

// 404 handler for unknown API routes
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3001;

// Only listen when executed directly as entrypoint, not when imported by test suites
const isDirectEntry = process.argv[1] && (
  process.argv[1].endsWith('server\\src\\index.ts') ||
  process.argv[1].endsWith('server/src/index.ts') ||
  process.env.AERO_START_SERVER === 'true'
);

if (isDirectEntry) {
  try {
    runMigrations();
    seedDatabase();
    const server = app.listen(PORT, () => {
      process.stdout.write(`AERO 34 API running on port ${PORT}\n`);
    });

    const shutdown = () => {
      server.close(() => {
        process.stdout.write('AERO 34 API gracefully terminated\n');
        process.exit(0);
      });
      setTimeout(() => process.exit(1), 5000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    process.stderr.write(`Failed to boot AERO 34 API: ${err}\n`);
    process.exit(1);
  }
}
