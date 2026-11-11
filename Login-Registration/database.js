
const path = require("path");
const Database = require("better-sqlite3");

// Use Render's persistent disk path when DB_PATH is configured.
// Otherwise, use the local project directory.
const dbPath = process.env.DB_PATH || path.join(__dirname, "legalconnect.db");

const db = new Database(dbPath);

// Users table
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

// Sessions table
db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
        sid TEXT PRIMARY KEY,
        sess TEXT NOT NULL,
        expired INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS sessions_expired_idx
    ON sessions(expired);
`);

console.log("Database connected successfully!");

module.exports = db;
