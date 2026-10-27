import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';

const BACKUP_DIR = path.resolve(import.meta.dirname, '../data/backups');
const DB_DIR = path.resolve(import.meta.dirname, '../data');
const TARGET_DB = path.join(DB_DIR, 'aero34.db');

// Find latest backup file
if (!fs.existsSync(BACKUP_DIR)) {
  console.error('No backup directory found.');
  process.exit(1);
}

const backups = fs.readdirSync(BACKUP_DIR).filter((f) => f.endsWith('.db')).sort().reverse();
if (backups.length === 0) {
  console.error('No backup files found in data/backups.');
  process.exit(1);
}

const latestBackup = path.join(BACKUP_DIR, backups[0]);
console.log(`Restoring database from latest backup: ${latestBackup}`);

// Verify integrity of the backup before restoring
const testDb = new Database(latestBackup, { readonly: true });
const check = testDb.prepare('PRAGMA integrity_check').get() as { integrity_check: string };
testDb.close();

if (check.integrity_check !== 'ok') {
  console.error(`Backup integrity verification failed: ${check.integrity_check}`);
  process.exit(1);
}

// Copy backup over destination database
fs.copyFileSync(latestBackup, TARGET_DB);
console.log(`✓ Database successfully restored and integrity verified from ${backups[0]}`);
process.exit(0);
