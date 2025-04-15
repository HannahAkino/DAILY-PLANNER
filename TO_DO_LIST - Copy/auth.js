// Sign up function - Create new user
function signUp() {
    const username = document.getElementById("signupUsername").value;
    const password = document.getElementById("signupPassword").value;

    if (username && password) {
        let users = JSON.parse(localStorage.getItem("users")) || []; // Retrieve existing users
        // Check if the username already exists
        if (users.some(user => user.username === username)) {
            alert("Username already exists. Please choose another one.");
        } else {
            // Create new user object
            const newUser = { username, password, tasks: [], completedTasks: [] };
            users.push(newUser); // Add the new user
            localStorage.setItem("users", JSON.stringify(users)); // Save updated list of users
            alert("Signup successful! You can now log in.");
            toggleForm("login");
        }
    } else {
        alert("Please fill in all fields.");
    }
}

// Log in function - Check username and password
function logIn() {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    const users = JSON.parse(localStorage.getItem("users")) || []; // Get all users

    // Find the user that matches the credentials
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        alert("Login successful!");
        localStorage.setItem("loggedInUser", JSON.stringify(user)); // Save logged-in user in localStorage
        localStorage.setItem('username', username); // Optionally save just the username too
        window.location.href = "main.html"; // Redirect to main page
    } else {
        alert("Invalid credentials. Try again.");
    }
}
function logout() {
    localStorage.removeItem('username'); // Remove the logged-in username
    localStorage.removeItem('loggedInUser'); // Remove the logged-in user data
    items = []; // Reset tasks
    completedItems = []; // Reset completed tasks
    renderItems(); // Re-render to clear task list
    renderCompletedTasks(); // Re-render to clear completed tasks
    window.location.reload(); // Reload the page to reset the UI
}

