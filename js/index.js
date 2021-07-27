/* module imports */
import * as apiHandler from "./api-handler.js";

/*
--------------------------------------------------------------------------------
On start execution code
--------------------------------------------------------------------------------
*/

/*
    index.js error states

    Any time we update the DOM regarding errors,
    these are updated. These states are used in the
    application to increase performance.
    (Example- only update the DOM when needed.)
*/
let loginFormIsErrorFree = true;
let signupFormIsErrorFree = true;

/* Hide any error messages by default */
document.getElementById("login-modal-error").style.visibility = 'hidden';
document.getElementById("signup-modal-error").style.visibility = 'hidden';

/* Clear form data */
clearFormData();

/* Set up the event listeners */
document.getElementById("login-modal-btn").addEventListener("click", login);
document.getElementById("signup-modal-btn").addEventListener("click", signup);
document.getElementById("login-modal-email").oninput = function () {
    if (!loginFormIsErrorFree)
        hideLoginError();
};
//document.getElementById("login-btn").addEventListener("click", loginFocus);
//document.getElementById("signup-btn").addEventListener("click", signupFocus);

/*
    When receiving input on the login or signup modal,
    clear the errors, only if an error is already showing.
*/
document.getElementById("login-modal-password").oninput = function () {
    if (!loginFormIsErrorFree)
        hideLoginError();
};
document.getElementById("signup-modal-username").oninput = function () {
    if (!signupFormIsErrorFree)
        hideLoginError();
};
document.getElementById("signup-modal-username").oninput = function () {
    if (!signupFormIsErrorFree)
        hideSignupError();
};
document.getElementById("signup-modal-email").oninput = function () {
    if (!signupFormIsErrorFree)
        hideSignupError();
};
document.getElementById("signup-modal-password").oninput = function () {
    if (!signupFormIsErrorFree)
        hideSignupError();
};

/*
--------------------------------------------------------------------------------
Functions
--------------------------------------------------------------------------------
*/

/* Give the login email focus */
function loginFocus() {
    // todo: implement me
}

/* Give the signup email focus */
function signupFocus() {
    // todo: implement me
}

/* Login attempt */
function login() {
    if (!validateLoginForm()) {
        return;
    }

    const email = document.getElementById("login-modal-email").value.trim();
    const password = document.getElementById("login-modal-password").value;

    console.log("login attempt");
    return;

    apiHandler.login(email, password, (data) => {
        // on success
        console.log("login success!", data);
        window.location = "/account.html";
    }, (err) => {
        // on failure
        console.log("login error!", err);
    });
}

/* Signup attempt */
function signup() {

    if (!validateSignupForm()) {
        return;
    }

    const username = document.getElementById("signup-modal-username").value.trim();
    const email = document.getElementById("signup-modal-email").value.trim().toLowerCase();
    const password = document.getElementById("signup-modal-password").value;

    console.log("signup attempt");
    return;

    apiHandler.signup(username, email, password, (data) => {
        // on success
        console.log("signup success!", data);
        window.location = "/account.html";
    }, (err) => {
        // on failure
        console.log("signup error!", err);
    });
}

/* Validate the login form */
function validateLoginForm() {
    const email = document.getElementById("login-modal-email").value.trim();
    const password = document.getElementById("login-modal-password").value;

    if (!validateEmail(email)) {
        showLoginError("Please enter a valid email address.");
        return false;
    } else if (password.length == 0) {
        showLoginError("Please enter a password.");
        return false;
    }

    hideLoginError();

    return true;
}

/* Validate the signup form */
function validateSignupForm() {
    const username = document.getElementById("signup-modal-username").value.trim();
    const email = document.getElementById("signup-modal-email").value.trim();
    const password = document.getElementById("signup-modal-password").value;

    if (username.length <= 3) {
        showSignupError("Username must be longer than 3 characters.");
        return false;
    } else if (!validateEmail(email)) {
        showSignupError("Please enter a valid email address.");
        return false;
    } else if (password.length == 0) {
        showSignupError("Please enter a password.");
        return false;
    }

    hideSignupError();

    return true;
}

/* Validate the email */
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/* Clear the data in the login and signup modals */
function clearFormData() {
    document.getElementById("login-modal-email").value = "";
    document.getElementById("login-modal-password").value = "";
    document.getElementById("signup-modal-username").value = "";
    document.getElementById("signup-modal-email").value = "";
    document.getElementById("signup-modal-password").value = "";
}

/*
    These functions show or hide errors
    on the login and signup modals.
*/
function showLoginError(errorMessage) {
    let loginModalError = document.getElementById("login-modal-error");
    loginModalError.innerHTML = errorMessage;
    loginModalError.style.visibility = 'visible';
    loginFormIsErrorFree = false;
}
function hideLoginError() {
    let loginModalError = document.getElementById("login-modal-error");
    loginModalError.innerHTML = "";
    loginModalError.style.visibility = 'hidden';
    loginFormIsErrorFree = true;
}
function showSignupError(errorMessage) {
    let signupModalError = document.getElementById("signup-modal-error");
    signupModalError.innerHTML = errorMessage;
    signupModalError.style.visibility = 'visible';
    signupFormIsErrorFree = false;
}
function hideSignupError() {
    let signupModalError = document.getElementById("signup-modal-error");
    signupModalError.innerHTML = "";
    signupModalError.style.visibility = 'hidden';
    signupFormIsErrorFree = false;
}
