
console.log("Welcome to LegalConnect!");

// ==========================================
// REGISTRATION
// ==========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const fullName = registerForm.elements.fullName.value;
        const email = registerForm.elements.email.value;
        const password = registerForm.elements.password.value;
        const userType = registerForm.elements.userType.value;

        const message = document.getElementById("registerMessage");

        if (password.length < 8) {
            message.textContent =
                "Password must contain at least 8 characters!";
            return;
        }

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    full_name: fullName,
                    email: email,
                    password: password,
                    role: userType === "client" ? "Client" : "Lawyer"
                })
            });

            const data = await response.json();

            message.textContent = data.message;

            if (response.ok) {
                registerForm.reset();
            }

        } catch (error) {
            message.textContent =
                "Unable to connect to the server.";

            console.error(error);
        }
    });
}


// ==========================================
// LOGIN ELEMENTS
// ==========================================

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutButton = document.getElementById("logoutButton");


// ==========================================
// CHECK EXISTING LOGIN SESSION
// ==========================================

async function checkLoginStatus() {
    try {
        const response = await fetch("/api/me", {
            credentials: "include"
        });

        if (response.ok) {
            const data = await response.json();

            // Restore welcome message
            if (loginMessage) {
                loginMessage.textContent =
                    "Welcome, " + data.user.full_name + "!";
            }

            // Show logout button
            if (logoutButton) {
                logoutButton.hidden = false;
            }

            // Hide login form
            if (loginForm) {
                loginForm.hidden = true;
            }

            console.log("User session restored:", data.user);

        } else {
            // User is not logged in
            if (logoutButton) {
                logoutButton.hidden = true;
            }

            if (loginForm) {
                loginForm.hidden = false;
            }
        }

    } catch (error) {
        console.error("Session check failed:", error);
    }
}


// Check session when the page loads
checkLoginStatus();


// ==========================================
// LOGIN
// ==========================================

if (loginForm) {
    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const email = loginForm.elements.email.value;
        const password = loginForm.elements.password.value;

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                if (loginMessage) {
                    loginMessage.textContent =
                        "Welcome, " + data.user.full_name + "!";
                }

                console.log("Logged in user:", data.user);

                // Hide login form
                loginForm.hidden = true;

                // Show logout button
                if (logoutButton) {
                    logoutButton.hidden = false;
                }

            } else {
                if (loginMessage) {
                    loginMessage.textContent = data.message;
                }
            }

        } catch (error) {
            if (loginMessage) {
                loginMessage.textContent =
                    "Unable to connect to the server.";
            }

            console.error(error);
        }
    });
}


// ==========================================
// LOGOUT
// ==========================================

if (logoutButton) {
    logoutButton.addEventListener("click", async function() {
        try {
            const response = await fetch("/api/logout", {
                method: "POST",
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                if (loginMessage) {
                    loginMessage.textContent = data.message;
                }

                // Hide logout button
                logoutButton.hidden = true;

                // Show login form again
                if (loginForm) {
                    loginForm.hidden = false;
                    loginForm.reset();
                }

                console.log("User logged out successfully.");
            }

        } catch (error) {
            console.error("Logout failed:", error);
        }
    });
}
