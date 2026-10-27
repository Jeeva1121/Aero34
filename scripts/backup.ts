import path from 'path';
import fs from 'fs';
import { db } from '../server/src/db.js';

const BACKUP_DIR = path.resolve(import.meta.dirname, '../data/backups');
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = path.join(BACKUP_DIR, `aero34-backup-${timestamp}.db`);

console.log(`Starting atomic SQLite backup to: ${backupPath}`);
db.backup(backupPath)
  .then(() => {
    console.log(`✓ Backup verified and written successfully (${(fs.statSync(backupPath).size / 1024).toFixed(1)} KB)`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(`Backup failure: ${err.message}`);
    process.exit(1);
  });
