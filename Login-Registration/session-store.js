
const session = require("express-session");
const db = require("./database");

class SQLiteSessionStore extends session.Store {
    constructor() {
        super();

        this.getStatement = db.prepare(`
            SELECT sess FROM sessions
            WHERE sid = ? AND expired > ?
        `);

        this.setStatement = db.prepare(`
            INSERT INTO sessions (sid, sess, expired)
            VALUES (?, ?, ?)
            ON CONFLICT(sid) DO UPDATE SET
                sess = excluded.sess,
                expired = excluded.expired
        `);

        this.destroyStatement = db.prepare(`
            DELETE FROM sessions WHERE sid = ?
        `);

        this.touchStatement = db.prepare(`
            UPDATE sessions
            SET expired = ?
            WHERE sid = ?
        `);

        this.cleanupStatement = db.prepare(`
            DELETE FROM sessions WHERE expired <= ?
        `);
    }

    get(sid, callback) {
        try {
            const row = this.getStatement.get(sid, Date.now());

            callback(null, row ? JSON.parse(row.sess) : null);
        } catch (error) {
            callback(error);
        }
    }

    set(sid, sessionData, callback) {
        try {
            const expired = sessionData.cookie?.expires
                ? new Date(sessionData.cookie.expires).getTime()
                : Date.now() + 24 * 60 * 60 * 1000;

            this.setStatement.run(
                sid,
                JSON.stringify(sessionData),
                expired
            );

            callback?.(null);
        } catch (error) {
            callback?.(error);
        }
    }

    destroy(sid, callback) {
        try {
            this.destroyStatement.run(sid);
            callback?.(null);
        } catch (error) {
            callback?.(error);
        }
    }

    touch(sid, sessionData, callback) {
        try {
            const expired = sessionData.cookie?.expires
                ? new Date(sessionData.cookie.expires).getTime()
                : Date.now() + 24 * 60 * 60 * 1000;

            this.touchStatement.run(expired, sid);
            callback?.(null);
        } catch (error) {
            callback?.(error);
        }
    }

    cleanup() {
        this.cleanupStatement.run(Date.now());
    }
}

module.exports = SQLiteSessionStore;
