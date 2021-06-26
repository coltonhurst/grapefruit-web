import * as apiHandler from "./api-handler.js";

/* Set up the event listeners */
document.getElementById("login-modal-btn").addEventListener("click", login);
document.getElementById("signup-modal-btn").addEventListener("click", signup);

function login() {
    const email = document.getElementById("login-modal-email").value.trim();
    const password = document.getElementById("login-modal-password").value.trim();

    apiHandler.login(email, password);
}

function signup() {
    const username = document.getElementById("signup-modal-username").value.trim();
    const email = document.getElementById("signup-modal-email").value.trim();
    const password = document.getElementById("signup-modal-password").value;

    apiHandler.signup(username, email, password);
}