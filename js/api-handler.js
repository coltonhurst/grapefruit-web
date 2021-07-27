/*
    API HANDLER MODULE

    When logged in, the encoded email and password should be
    saved in localStorage under the key "Authorization". This
    will be used for all calls so the user does not have to
    continually authenticate themselves. Upon logging out,
    this should be cleared. Doing it this way also allows
    the user to remain logged in even if they leave and come back.

    If the API returns an HTTP status of 401 or 403, the logout()
    function will be called, forcing the user to sign in again.
*/

const API_URL_V1 = 'http://127.0.0.1:8000/v1/';

/* Facilitates login */
function login(email, password, successFunc, failureFunc) {
    const url = API_URL_V1 + 'member';
    const authHeader = "Basic " + btoa(email + ":" + password);

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
        }
    };

    fetch(url, options).then(function (response) {
        // success
        localStorage.setItem("Authorization", authHeader);
        successFunc(response.json());
    }).catch(function (err) {
        // failure
        failureFunc(err);
    });
}

/* Facilitates signup */
function signup(username, email, password, successFunc, failureFunc) {
    const url = API_URL_V1 + 'member';
    const body = {
        email: email,
        username: username
    };
    const authHeader = "Basic " + btoa(email + ":" + password);

    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
        }
    };

    fetch(url, options).then(function (response) {
        // success
        localStorage.setItem("Authorization", authHeader);
        successFunc(response.json());
    }).catch(function (err) {
        // failure
        failureFunc(err);
    });
}

/* Facilitates logout */
function logout() {
    localStorage.removeItem("Authorization");
    window.location = "/index.html";
}

/* Facilitates getting the posts */
function getPosts(successFunc, failureFunc) {
    const url = API_URL_V1 + 'posts';

    fetch(url).then(function (response) {
        // success
        successFunc(response.json());
    }).catch(function (err) {
        // failure
        failureFunc(err);
    });
}

export { login, signup, getPosts };
