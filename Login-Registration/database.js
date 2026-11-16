
const path = require("path");
const Database = require("better-sqlite3");
const dbPath = process.env.DB_PATH || path.join(__dirname, "legalconnect.db");

const db = new Database(dbPath);

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
