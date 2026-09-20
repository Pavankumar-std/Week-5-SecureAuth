// ===============================
// Demo User Data
// ===============================

let users = JSON.parse(localStorage.getItem("secureAuthUsers")) || [
    {
        name: "Pavan Kumar",
        email: "pavan@example.com",
        password: "Pavan123",
        role: "admin"
    },
    {
        name: "Rahul Sharma",
        email: "rahul@example.com",
        password: "Rahul123",
        role: "user"
    },
    {
        name: "Anjali Reddy",
        email: "anjali@example.com",
        password: "Anjali123",
        role: "user"
    },
    {
        name: "Arjun Kumar",
        email: "arjun@example.com",
        password: "Arjun123",
        role: "user"
    }
];

localStorage.setItem("secureAuthUsers", JSON.stringify(users));

let signupMode = false;


// ===============================
// Login / Signup Toggle
// ===============================

function toggleForm() {

    signupMode = !signupMode;

    const nameGroup = document.getElementById("nameGroup");
    const formTitle = document.getElementById("formTitle");
    const formSubtitle = document.getElementById("formSubtitle");
    const submitText = document.getElementById("submitText");
    const switchText = document.getElementById("switchText");
    const switchBtn = document.getElementById("switchBtn");

    if (signupMode) {

        nameGroup.classList.remove("hidden");

        formTitle.textContent = "Create Account";

        formSubtitle.textContent =
            "Create your secure account";

        submitText.textContent = "Sign Up";

        switchText.textContent =
            "Already have an account?";

        switchBtn.textContent = "Login";

    } else {

        nameGroup.classList.add("hidden");

        formTitle.textContent = "Welcome Back";

        formSubtitle.textContent =
            "Login to access your dashboard";

        submitText.textContent = "Login";

        switchText.textContent =
            "Don't have an account?";

        switchBtn.textContent = "Sign Up";
    }

    document.getElementById("message").textContent = "";
}


// ===============================
// Login / Signup
// ===============================

function submitAuth() {

    const name =
        document.getElementById("name")?.value.trim();

    const email =
        document.getElementById("email").value.trim().toLowerCase();

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("message");


    // Basic validation

    if (!email || !password || (signupMode && !name)) {

        message.textContent =
            "Please fill in all required fields.";

        message.style.color = "#ff6b6b";

        return;
    }


    // Email validation

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

        message.textContent =
            "Please enter a valid email address.";

        message.style.color = "#ff6b6b";

        return;
    }


    // Password validation

    if (password.length < 6) {

        message.textContent =
            "Password must contain at least 6 characters.";

        message.style.color = "#ff6b6b";

        return;
    }


    // SIGNUP

    if (signupMode) {

        const existingUser =
            users.find(user => user.email === email);

        if (existingUser) {

            message.textContent =
                "Email already registered.";

            message.style.color = "#ff6b6b";

            return;
        }


        const newUser = {
            name: name,
            email: email,
            password: password,
            role: "user"
        };

        users.push(newUser);

        localStorage.setItem(
            "secureAuthUsers",
            JSON.stringify(users)
        );

        message.textContent =
            "Account created successfully! Please login.";

        message.style.color = "#35d07f";

        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";

        toggleForm();

        return;
    }


    // LOGIN

    const user =
        users.find(
            user =>
                user.email === email &&
                user.password === password
        );


    if (!user) {

        message.textContent =
            "Invalid email or password.";

        message.style.color = "#ff6b6b";

        return;
    }


    // Save logged-in user

    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(user)
    );


    // Redirect based on role

    if (user.role === "admin") {

        window.location.href = "admin.html";

    } else {

        window.location.href = "dashboard.html";

    }
}


// ===============================
// Dashboard Protection
// ===============================

function checkLogin() {

    const user =
        JSON.parse(localStorage.getItem("loggedInUser"));

    if (!user) {

        window.location.href = "index.html";

        return null;
    }

    return user;
}


// ===============================
// Load Dashboard
// ===============================

if (window.location.pathname.includes("dashboard.html")) {

    const user = checkLogin();

    if (user) {

        document.getElementById("userName").textContent =
            user.name;

        document.getElementById("profileName").textContent =
            user.name;

        document.getElementById("profileEmail").textContent =
            user.email;

        document.getElementById("profileRole").textContent =
            user.role;
    }
}


// ===============================
// Admin Protection
// ===============================

if (window.location.pathname.includes("admin.html")) {

    const user = checkLogin();

    if (user && user.role !== "admin") {

        alert("Admin access required.");

        window.location.href = "dashboard.html";
    }
}


// ===============================
// Search Users
// ===============================

function searchUsers() {

    const input =
        document.getElementById("userSearch");

    const searchText =
        input.value.toLowerCase();

    const rows =
        document.querySelectorAll("#usersTable tr");

    rows.forEach(row => {

        const text =
            row.textContent.toLowerCase();

        row.style.display =
            text.includes(searchText)
                ? ""
                : "none";
    });
}


// ===============================
// Delete User
// ===============================

function deleteUser(button) {

    const row = button.closest("tr");

    const name =
        row.cells[0].textContent;

    const confirmDelete =
        confirm(
            `Are you sure you want to delete ${name}?`
        );

    if (!confirmDelete) {
        return;
    }


    const email =
        row.cells[1].textContent;


    users =
        users.filter(user => user.email !== email);


    localStorage.setItem(
        "secureAuthUsers",
        JSON.stringify(users)
    );


    row.remove();


    updateStatistics();
}


// ===============================
// Update Admin Statistics
// ===============================

function updateStatistics() {

    const total =
        document.querySelectorAll("#usersTable tr").length;

    const totalElement =
        document.getElementById("totalUsers");

    if (totalElement) {
        totalElement.textContent = total;
    }
}


// ===============================
// Logout
// ===============================

function logout() {

    localStorage.removeItem("loggedInUser");

    window.location.href = "index.html";
}