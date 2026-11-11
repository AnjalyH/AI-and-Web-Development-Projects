
require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const db = require("./database");
const SQLiteSessionStore = require("./session-store");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("trust proxy", 1);

if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is missing. Check your environment variables.");
}

// Session configuration
app.use(
    session({
        store: new SQLiteSessionStore(),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000
        }
    })
);

// Test backend
app.get("/api/test", (req, res) => {
    res.json({
        message: "LegalConnect backend is working!"
    });
});

// User registration
app.post("/api/register", async (req, res) => {
    try {
        const { full_name, email, password, role } = req.body;

        if (!full_name || !email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters."
            });
        }

        if (!["Client", "Lawyer"].includes(role)) {
            return res.status(400).json({
                message: "Invalid user role."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUser = db.prepare(`
            INSERT INTO users (full_name, email, password_hash, role)
            VALUES (?, ?, ?, ?)
        `);

        insertUser.run(
            full_name.trim(),
            email.trim().toLowerCase(),
            hashedPassword,
            role
        );

        res.status(201).json({
            message: "Registration successful!"
        });

    } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(409).json({
                message: "Email already registered."
            });
        }

        console.error(error);

        res.status(500).json({
            message: "Server error. Please try again."
        });
    }
});

// User login
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        // Find the user using their email
        const user = db.prepare(
            "SELECT * FROM users WHERE email = ?"
        ).get(email.trim().toLowerCase());

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Compare entered password with stored bcrypt hash
        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Create a new session after successful login
        req.session.regenerate((error) => {
            if (error) {
                return res.status(500).json({
                    message: "Could not create login session."
                });
            }

            req.session.user = {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            };

            res.json({
                message: "Login successful!",
                user: req.session.user
            });
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error. Please try again."
        });
    }
});

// Check whether a user is logged in
app.get("/api/me", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            message: "Not logged in."
        });
    }

    res.json({
        user: req.session.user
    });
});

// User logout
app.post("/api/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                message: "Logout failed."
            });
        }

        res.clearCookie("connect.sid");

        res.json({
            message: "Logged out successfully."
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`LegalConnect server running at http://localhost:${PORT}`);
});
