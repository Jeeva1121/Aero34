-- 001_initial_schema.sql
-- Numbered SQL Migration for AERO 34

CREATE TABLE IF NOT EXISTS routes (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  origin_city TEXT NOT NULL,
  origin_code TEXT NOT NULL,
  dest_city TEXT NOT NULL,
  dest_code TEXT NOT NULL,
  region TEXT NOT NULL,
  block_time TEXT NOT NULL,
  block_minutes INTEGER NOT NULL,
  distance_km INTEGER NOT NULL,
  aircraft TEXT NOT NULL,
  cabin_layout TEXT NOT NULL,
  total_seats INTEGER NOT NULL,
  altitude_feet INTEGER NOT NULL,
  hero_image TEXT NOT NULL,
  overview TEXT NOT NULL,
  origin_lat REAL NOT NULL,
  origin_lng REAL NOT NULL,
  dest_lat REAL NOT NULL,
  dest_lng REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS availability (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  route_id TEXT NOT NULL,
  date TEXT NOT NULL, -- YYYY-MM-DD
  month TEXT NOT NULL, -- YYYY-MM
  seats_left INTEGER NOT NULL,
  total_seats INTEGER NOT NULL,
  UNIQUE(route_id, date),
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS requests (
  ref TEXT PRIMARY KEY,
  route_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  dates TEXT NOT NULL,
  party_size INTEGER NOT NULL,
  note TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Received', -- 'Received', 'Confirming', 'Held', 'Declined'
  idempotency_key TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (route_id) REFERENCES routes(id)
);

CREATE TABLE IF NOT EXISTS shortlist (
  session_id TEXT NOT NULL,
  route_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (session_id, route_id),
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  admin_id INTEGER NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS email_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued', -- 'queued', 'sent', 'failed'
  retries INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  sent_at DATETIME
);

CREATE INDEX IF NOT EXISTS idx_availability_route_month ON availability(route_id, month);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON requests(created_at);
