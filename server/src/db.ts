import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.resolve(import.meta.dirname, '../../data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = process.env.DATABASE_PATH || path.join(DB_DIR, 'aero34.db');
export const db = new Database(DB_PATH);

// Pragmas for ultra-fast, safe, crash-resilient operations
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');

export function runMigrations() {
  const migrationsDir = path.resolve(import.meta.dirname, 'migrations');
  if (!fs.existsSync(migrationsDir)) return;

  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  const getApplied = db.prepare('SELECT name FROM _migrations WHERE name = ?');
  const recordMigration = db.prepare('INSERT INTO _migrations (name) VALUES (?)');

  for (const file of files) {
    const applied = getApplied.get(file);
    if (!applied) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      db.transaction(() => {
        db.exec(sql);
        recordMigration.run(file);
      })();
    }
  }
}
