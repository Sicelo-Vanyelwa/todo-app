const Database = require('better-sqlite3');
const path = require('path');

// Resolve the path where the database file will be saved
const dbPath = path.resolve(process.cwd(), 'local.db');
const db = new Database(dbPath);

// Execute SQL query to create a table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    due_date TEXT NOT NULL,
    topic TEXT NOT NULL,
    archived BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'Todo',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;
