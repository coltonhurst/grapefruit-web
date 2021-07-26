import * as apiHandler from "./api-handler.js";

/* Set up the event listeners */
document.getElementById("login-modal-btn").addEventListener("click", login);
document.getElementById("signup-modal-btn").addEventListener("click", signup);

function validateLoginForm() {

    return true;
}

function validateSignupForm() {

    return true;
}

function login() {
    if (!validateLoginForm()) {
        return;
    }

    const email = document.getElementById("login-modal-email").value.trim();
    const password = document.getElementById("login-modal-password").value.trim();

    apiHandler.login(email, password, (data) => {
        // on success
        console.log("login success!", data);
        window.location = "/account.html";
    }, (err) => {
        // on failure
        console.log("login error!", err);
    });
}

function signup() {

    if (!validateSignupForm()) {
        return;
    }

    const username = document.getElementById("signup-modal-username").value.trim();
    const email = document.getElementById("signup-modal-email").value.trim();
    const password = document.getElementById("signup-modal-password").value;

    apiHandler.signup(username, email, password, (data) => {
        // on success
        console.log("signup success!", data);
        window.location = "/account.html";
    }, (err) => {
        // on failure
        console.log("signup error!", err);
    });
}
