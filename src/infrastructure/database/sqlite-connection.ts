// Infrastructure Layer - SQLite Database Connection
import Database from 'better-sqlite3';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', '..', '..', 'data');

export function createDatabase(dbName = 'tasks.db'): Database.Database {
    if (!existsSync(DATA_DIR)) {
        mkdirSync(DATA_DIR, { recursive: true });
    }

    const dbPath = join(DATA_DIR, dbName);
    const db = new Database(dbPath);

    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    initializeSchema(db);

    return db;
}

function initializeSchema(db: Database.Database): void {
    db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_title ON tasks(title);
    CREATE INDEX IF NOT EXISTS idx_tasks_description ON tasks(description);
  `);
}

export type DatabaseConnection = Database.Database;
