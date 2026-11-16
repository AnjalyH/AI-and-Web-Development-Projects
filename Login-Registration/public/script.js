
console.log("Welcome to LegalConnect!");



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



const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutButton = document.getElementById("logoutButton");




async function checkLoginStatus() {

    if (!loginForm) return;

    try {
        const response = await fetch("/api/me", {
            credentials: "include"
        });

        if (response.ok) {
            window.location.href = "dashboard.html";
        }

    } catch (error) {
        console.error("Session check failed:", error);
    }
}

checkLoginStatus();



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

                console.log("Logged in user:", data.user);

                window.location.href = "dashboard.html";

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

                logoutButton.hidden = true;

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
