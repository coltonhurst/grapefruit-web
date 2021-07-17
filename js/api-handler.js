/* API HANDLER MODULE */

const API_URL_V1 = 'http://127.0.0.1:8000/v1/';

/*
    This function will communicate with the API
    regarding logging in.
    It requires an email, password, successFunc,
    and failureFunc to call at the resolution of the call.
*/
function login(email, password, successFunc, failureFunc) {

    const url = API_URL_V1 + 'member/bd8a8c6a-701b-4efb-9fb0-d0220497c613';

    fetch(url).then(function (response) {
        // The API call was successful!
        successFunc(response.json());
    }).catch(function (err) {
        // The call failed :(
        failureFunc(err);
    });

}

/*
    This function will communicate with the API
    regarding signing up.
*/
function signup(username, email, password) {
    console.log("Signup attempt:");
    console.log(username);
    console.log(email);
    console.log(password);

    return true; // simulate working signup
}


export { login, signup };
