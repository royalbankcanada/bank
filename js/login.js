// =======================================
// CGB BANK LOGIN
// =======================================

const API_URL = "https://canada-1.onrender.com";

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("loginForm");

    if (!form) {
        console.error("Formulaire loginForm introuvable !");
        return;
    }

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const client = document.getElementById("client").value.trim().toUpperCase();
        const access = document.getElementById("access").value.trim();
        const password = document.getElementById("password").value.trim();

        // =============================
        // ADMIN
        // =============================

        if (
            client === "ADMIN" &&
            access === "ADMIN" &&
            password === "ADMIN123"
        ) {

            localStorage.setItem("role", "admin");
            localStorage.setItem("isLoggedIn", "true");

            localStorage.setItem("currentUser", JSON.stringify({
                id: "ADMIN",
                name: "Administrator",
                access: "ADMIN",
                account: "ADMIN",
                balance: 0
            }));

            alert("Connexion Administrateur réussie.");

            window.location.href = "admin.html";

            return;
        }

        // =============================
        // CLIENT
        // =============================

        try {

            const response = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    customerId: client,
                    accessCode: access,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Customer ID, Access Code ou Password incorrect.");
                return;
            }

            localStorage.setItem("role", "client");
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("token", data.token);

            localStorage.setItem("currentUser", JSON.stringify(data.customer));

            alert(`Bienvenue ${data.customer.firstName} ${data.customer.lastName}`);

            window.location.href = "dashboard.html";

        } catch (error) {

            console.error(error);

            alert("Impossible de contacter le serveur.");

        }

    });

});
