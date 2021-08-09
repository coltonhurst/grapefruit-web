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
let accountFormIsErrorFree = true;
let postFormIsErrorFree = true;

/* Hide any error messages by default */
document.getElementById("login-modal-error").style.visibility = 'hidden';
document.getElementById("signup-modal-error").style.visibility = 'hidden';
document.getElementById("account-modal-error").style.visibility = 'hidden';
document.getElementById("post-modal-error").style.visibility = 'hidden';

/* Show user account button if logged in */
handleAccountButton();

/* Clear form data */
clearFormData();

/* Set up the event listeners */
document.getElementById("login-modal-btn").addEventListener("click", login);
document.getElementById("signup-modal-btn").addEventListener("click", signup);
document.getElementById("account-modal-btn").addEventListener("click", updateAccount);
document.getElementById("nav-log-out-button").addEventListener("click", logout);
document.getElementById("post-modal-btn").addEventListener("click", createPost);
//document.getElementById("login-btn").addEventListener("click", loginFocus);
//document.getElementById("signup-btn").addEventListener("click", signupFocus);

/* On load, get the posts */
getPosts();

/*
    When receiving input on the login or signup modal,
    clear the errors, only if an error is already showing.
*/
document.getElementById("login-modal-email").oninput = function () {
  if (!loginFormIsErrorFree)
    hideLoginError();
};
document.getElementById("login-modal-password").oninput = function () {
  if (!loginFormIsErrorFree)
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
document.getElementById("account-modal-email").oninput = function () {
  if (!accountFormIsErrorFree)
    hideAccountError();
};
document.getElementById("account-modal-password").oninput = function () {
  if (!accountFormIsErrorFree)
    hideAccountError();
};
document.getElementById("account-modal-password-two").oninput = function () {
  if (!accountFormIsErrorFree)
    hideAccountError();
};
document.getElementById("post-modal-title").oninput = function () {
  if (!postFormIsErrorFree)
    hidePostError();
};
document.getElementById("post-modal-body").oninput = function () {
  if (!postFormIsErrorFree)
    hidePostError();
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

  apiHandler.login(email, password, (data) => {
    if (isNullOrWhitespace(data.error)) {
      localStorage.setItem("member", JSON.stringify({
        "authorization": data.authorization,
        "username": data.username,
        "email": data.email,
        "guid": data.guid
      }));
      handleAccountButton();
      window.location = "/index.html";
    } else {
      handleAccountButton();
      showLoginError(data.error);
    }
  });
}

function logout() {
  apiHandler.logout();
}

/* Update the user account */
function updateAccount() {
  if (!validateAccountForm()) {
    return;
  }

  const newEmail = document.getElementById("account-modal-email").value.trim().toLowerCase();
  const newPassword = document.getElementById("account-modal-password").value;

  apiHandler.updateMember(newEmail, newPassword, (data) => {
    if (isNullOrWhitespace(data.error)) {
      localStorage.setItem("member", JSON.stringify({
        "authorization": data.authorization,
        "username": data.username,
        "email": data.email,
        "guid": data.guid
      }));
      window.location = "/index.html";
    } else {
      showAccountError(data.error);
    }
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

  apiHandler.signup(username, email, password, (data) => {
    if (isNullOrWhitespace(data.error)) {
      localStorage.setItem("member", JSON.stringify({
        "authorization": data.authorization,
        "username": data.username,
        "email": data.email,
        "guid": data.guid
      }));
      handleAccountButton();
      window.location = "/index.html";
    } else {
      handleAccountButton();
      showLoginError(data.error);
    }
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

/* Validate the account form */
function validateAccountForm() {
  const email = document.getElementById("account-modal-email").value.trim();
  const password = document.getElementById("account-modal-password").value;
  const passwordTwo = document.getElementById("account-modal-password-two").value;

  if (!validateEmail(email)) {
    showAccountError("Please enter a valid email address.");
    return false;
  } else if (password.length == 0) {
    showAccountError("Please enter a password.");
    return false;
  } else if (password != passwordTwo) {
    showAccountError("Passwords must match");
    return false;
  }

  hideAccountError();

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
function showAccountError(errorMessage) {
  let accountModalError = document.getElementById("account-modal-error");
  accountModalError.innerHTML = errorMessage;
  accountModalError.style.visibility = 'visible';
  accountFormIsErrorFree = false;
}
function hideAccountError() {
  let accountModalError = document.getElementById("account-modal-error");
  accountModalError.innerHTML = "";
  accountModalError.style.visibility = 'hidden';
  accountFormIsErrorFree = false;
}
function showPostError(errorMessage) {
  let postModalError = document.getElementById("post-modal-error");
  postModalError.innerHTML = errorMessage;
  postModalError.style.visibility = 'visible';
  postFormIsErrorFree = false;
}
function hidePostError() {
  let postModalError = document.getElementById("post-modal-error");
  postModalError.innerHTML = "";
  postModalError.style.visibility = 'hidden';
  postFormIsErrorFree = false;
}

/*
  Returns true if data is undefined, null, or whitespace.
*/
function isNullOrWhitespace(data) {
  return data == undefined || data == null || data.trim() == "";
}

/* */
function handleAccountButton() {
  if (localStorage.getItem("member") != undefined && localStorage.getItem("member") != null) {
    let guid = JSON.parse(localStorage.getItem("member")).guid;

    if (guid != undefined && guid != null && guid.length > 0) {
      showUserAccountButton(JSON.parse(localStorage.getItem("member")).username);
    } else {
      showUserLoginButton();
    }
  } else {
    showUserLoginButton();
  }
}

/* Show the user account button and hide the login / signup button */
function showUserAccountButton(username) {
  document.getElementById("nav-not-logged-in").style.visibility = "collapse";
  document.getElementById("nav-not-logged-in").style.display = "none";
  document.getElementById("nav-logged-in").style.visibility = "visible";
  document.getElementById("nav-logged-in").style.display = "block";

  document.getElementById("nav-logged-in-button").innerHTML = username;
  document.getElementById("account-modal-email").value = JSON.parse(localStorage.getItem("member")).email;
  document.getElementById("account-modal-password").value = "";
}

function showUserLoginButton() {
  document.getElementById("nav-logged-in").style.visibility = "collapse";
  document.getElementById("nav-logged-in").style.display = "none";
  document.getElementById("nav-not-logged-in").style.visibility = "visible";
  document.getElementById("nav-not-logged-in").style.display = "block";

  document.getElementById("nav-logged-in-button").innerHTML = "";
}

function getPosts() {
  const postsContainer = document.getElementById("content");
  postsContainer.innerHTML = '<h1>Posts</h1>';

  if (!isNullOrWhitespace(localStorage.getItem("member")) && !isNullOrWhitespace(JSON.parse(localStorage.getItem("member")).guid)) {
    postsContainer.innerHTML += '<div><button class="btn btn-primary" id="btn-create-post" data-bs-toggle="modal" data-bs-target="#post-modal">Create a Post</button></div><br>';
  }

  apiHandler.getPosts((data) => {
    if (isNullOrWhitespace(data.error) && data.posts.length > 0) {

      // sort posts... most recent first (descending)
      let posts = data.posts.sort((a,b) => (a.date < b.date ? 1 : a.date < b.date ? -1 : 0));
      let postCounter = 0;

      posts.forEach(post => {
        let likedUsers = post.likes.split(",");
        const numberOflikes = likedUsers.length < 1 ? 0 : likedUsers.length - 1;
        postCounter++;
        const postId = "post-id-" + postCounter;

        // if the user has liked the post, make sure the like "heart" is filled in
        if (likedUsers.includes(JSON.parse(localStorage.getItem("member")).guid)) {
          postsContainer.innerHTML = postsContainer.innerHTML +
          '<div class="member-post bg-light p-2 rounded">' +
          '<h4>' + post.title + '</h4>' +
          '<div style="color: grey;">' + post.author + ' on ' + post.date + '</div><br>' +
          '<div>' + post.body + '</div><br>' +
          '<div><img src="./images/heart-filled.png" alt="" height="25px" id="' + postId + '"> ' + numberOflikes + '</div>' +
          '</div><br>';
          //document.getElementById(postId).addEventListener("click", likePost(post.guid, "unlike"));
          document.getElementById(postId).addEventListener("click", () => {
            const source = document.getElementById(postId).src.split("/")[document.getElementById(postId).src.split("/").length - 1];

            if (source == "heart-filled.png") {
              likePost(post.guid, postId, "unlike");
            } else if (source == "heart.png") {
              likePost(post.guid, postId, "like");
            }
          });
        } 
        else
        { // otherwise, the like "heart" is not filled in
          postsContainer.innerHTML = postsContainer.innerHTML +
          '<div class="member-post bg-light p-2 rounded">' +
          '<h4>' + post.title + '</h4>' +
          '<div style="color: grey;">' + post.author + ' on ' + post.date + '</div><br>' +
          '<div>' + post.body + '</div><br>' +
          '<div><img src="./images/heart.png" alt="" height="25px" id="' + postId + '"> ' + numberOflikes + '</div>' +
          '</div><br>';
          document.getElementById(postId).addEventListener("click", () => {
            const source = document.getElementById(postId).src.split("/")[document.getElementById(postId).src.split("/").length - 1];

            if (source == "heart-filled.png") {
              likePost(post.guid, postId, "unlike");
            } else if (source == "heart.png") {
              likePost(post.guid, postId, "like");
            }
          });
        }

      });
    } else {
      postsContainer.innerHTML = postsContainer.innerHTML + "There are no posts!";
    }
  });
}

function likePost(postGuid, postId, action) {
  console.log(postGuid);
  console.log(postId);
  console.log(action);

  if (action == "like") {
    document.getElementById(postId).src = "./images/heart-filled.png";
  } else if (action == "unlike") {
    document.getElementById(postId).src = "./images/heart.png";
  }
}

function createPost() {
  if (!validatePostForm()) {
    return;
  }

  const postTitle = document.getElementById("post-modal-title").value.trim();
  const postBody = document.getElementById("post-modal-body").value.trim();

  apiHandler.createPost(postTitle, postBody, (data) => {
    if (isNullOrWhitespace(data.error)) {
      document.getElementById("post-modal-title").value = "";
      document.getElementById("post-modal-body").value = "";
      window.location = "/index.html";
    } else {
      showPostError(data.error);
    }
  });
}

function validatePostForm() {
  const title = document.getElementById("post-modal-title").value.trim();
  const body = document.getElementById("post-modal-body").value.trim();

  if (title.length < 1) {
    showPostError("Please enter a post title!");
    return false;
  } else if (body.length < 1) {
    showPostError("Please enter some post content!");
    return false;
  }

  hidePostError();

  return true;
}
