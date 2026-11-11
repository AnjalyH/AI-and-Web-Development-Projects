# LegalConnect – Full Stack Web Application

LegalConnect is a web application where users can register as clients or lawyers and log in using their registered accounts.

I developed this project to practise connecting a frontend with a backend and database, while learning how user authentication works in a real web application.

## Features

- User registration with name, email, password and account type.
- Separate account types for clients and lawyers.
- Password hashing using bcrypt before storing passwords.
- Login with registered email and password.
- Session-based login to maintain the user's authenticated state.
- Logout functionality.
- Validation for required fields, password length and duplicate email addresses.

## Technologies Used

| Part | Technologies |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | SQLite |
| Password Security | bcrypt |
| Session Management | express-session |

## Project Structure

```text
LegalConnect-FullStack/
│
├── public/
│   ├── index.html
│   ├── register.html
│   ├── login.html
│   ├── style.css
│   └── script.js
│
├── database.js
├── server.js
├── package.json
├── package-lock.json
├── .env
└── README.md
```

The `.env` file and database file are created locally and are not included in the GitHub repository.

## Running the Project Locally

**1. Clone the repository**

```bash
git clone https://github.com/AnjalyH/LegalConnect-fullstack.git
```

**2. Open the project folder**

```bash
cd LegalConnect-fullstack
```

**3. Install the required packages**

```bash
npm install
```

**4. Create a `.env` file** in the project root and add:

```env
SESSION_SECRET=your_random_secret
```

Replace `your_random_secret` with a randomly generated secret.

**5. Start the server**

```bash
npm start
```

**6. Open the application**

Visit:

http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Creates a new user account |
| POST | `/api/login` | Verifies user credentials and starts a session |
| GET | `/api/me` | Checks the current login session |
| POST | `/api/logout` | Ends the current session |

## Database

The application uses SQLite to store user information. The database and users table are created automatically when the application runs for the first time.

Passwords are stored as bcrypt hashes rather than plain text.

## What I Learned

While building LegalConnect, I got practical experience with:

- Connecting frontend forms to backend API routes.
- Handling registration and login requests using JavaScript `fetch()`.
- Storing and retrieving user information from SQLite.
- Hashing and verifying passwords.
- Managing login sessions using Express.

## Project Status

This is an academic learning project. The current version focuses on user registration and authentication. Additional features such as lawyer dashboards, client dashboards and appointment booking can be developed in future versions.

**Note:** The current Express session configuration uses the default MemoryStore, which is suitable for local development but should be replaced with a persistent session store before production deployment.
