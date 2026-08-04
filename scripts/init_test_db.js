import Database from "better-sqlite3";

const db = new Database(":memory:");

export function resetDatabase() {
    db.exec(`
        DROP TABLE IF EXISTS tasks;

        CREATE TABLE tasks (
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
}

export default db;