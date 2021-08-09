/*
    API HANDLER MODULE

    When logged in, the encoded email and password should be
    saved in localStorage under the member object. This
    will be used for all calls so the user does not have to
    continually authenticate themselves. Upon logging out,
    this should be cleared. Doing it this way also allows
    the user to remain logged in even if they leave and come back.
    User data should be stored in the 'member' object in local storage.

    If the API returns an HTTP status of 401 or 403, the logout()
    function will be called, forcing the user to sign in again.

    The following are supported below:
    /member
      POST   | create a member | signup()
      GET    | member login    | login()
      PUT    | update a member | updateMember()

    /posts
      POST   | create a post   | createPost()
      PUT    | update a post   | updatePost()
      GET    | get posts       | getPosts()
      DELETE | delete a post   | deletePost()

    /comments
      POST   | create a comment| createComment()
      PUT    | update a comment| updateComment()
      GET    | get comments    | getComments()
      DELETE | delete a post   | deleteComment()

    /likepost
      POST   | like a post     | likeAPost()

    /likecomment
      POST   | like a comment  | likeAComment()
*/

const API_URL_V1 = 'http://127.0.0.1:8000/v1/';

/* Facilitates signup */
function signup(username, email, password, actionFunc) {
  const url = API_URL_V1 + 'member';
  const authHeader = btoa(email + ":" + password);
  const body = {
    authorization: authHeader,
    email: email,
    username: username
  };

  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    /*headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    }*/
  };

  fetch(url, options).then(function (response) {
    return response.json();
  }).then((response) => {
    actionFunc(response);
  }).catch(function (err) {
    // failure
    console.log(err);
  });
}

/* Facilitates login */
function login(email, password, actionFunc) {
  const url = API_URL_V1 + 'login';
  const authHeader = btoa(email + ":" + password);
  const body = {
    authorization: authHeader,
    email: email
  };

  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    /*headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
    }*/
  };

  fetch(url, options).then(function (response) {
    return response.json();
  }).then((response) => {
    actionFunc(response);
  }).catch(function (err) {
    // failure
    console.log(err);
  });
}

/* Facilitates updating member email and password */
function updateMember(newEmail, newPassword, actionFunc) {
  const url = API_URL_V1 + 'member/' + JSON.parse(localStorage.getItem("member")).guid;
  const authHeader = JSON.parse(localStorage.getItem("member")).authorization;
  const body = {
    authorization: authHeader,
    email: newEmail,
    username: JSON.parse(localStorage.getItem("member")).username,
    guid: JSON.parse(localStorage.getItem("member")).guid,
    new_authorization: btoa(newEmail + ":" + newPassword)
  };

  const options = {
    method: 'PUT',
    body: JSON.stringify(body),
    // headers: {
    //   'Content-Type': 'application/json',
    //   'Authorization': authHeader
    // }
  };

  fetch(url, options).then(function (response) {
    return response.json();
  }).then((response) => {
    actionFunc(response);
  }).catch(function (err) {
    // failure
    console.log(err);
  });
}

/* Facilitates logout */
function logout() {
  localStorage.removeItem("member");
  window.location = "/index.html";
}

/* Facilitates creating a post */
function createPost(postTitle, postBody, actionFunc) {
  const url = API_URL_V1 + 'posts';
  const authHeader = JSON.parse(localStorage.getItem("member")).authorization;
  const body = {
    authorization: authHeader,
    guid: createUUID(),
    author: JSON.parse(localStorage.getItem("member")).username,
    title: postTitle,
    date: getDate(),
    body: postBody,
    likes: "0"
  };

  console.log(body);

  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    /*headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
    }*/
  };

  fetch(url, options).then(function (response) {
    return response.json();
  }).then((response) => {
    actionFunc(response);
  }).catch(function (err) {
    // failure
    console.log(err);
  });
}

/* Facilitates updating a post */
function updatePost(postGuid, newPostBody, successFunc, failureFunc) {
  const url = API_URL_V1 + 'posts';
  const authHeader = localStorage.getItem("Authorization");
  const body = {
    id: postGuid,
    body: newPostBody
  };

  const options = {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    }
  };

  fetch(url).then(function (response) {
    // success
    successFunc(response.json());
  }).catch(function (err) {
    // failure
    failureFunc(err);
  });
}

/* Facilitates getting the posts */
function getPosts(actionFunc) {
  const url = API_URL_V1 + 'posts';
  const options = {
    method: 'GET',
    //body: JSON.stringify(body),
    // headers: {
    //   'Content-Type': 'application/json',
    //   'Authorization': authHeader
    // }
  };

  fetch(url, options).then(function (response) {
    return response.json();
  }).then((response) => {
    actionFunc(response);
  }).catch(function (err) {
    // failure
    console.log(err);
  });
}

/* Facilitates deleting a post */
function deletePost(postGuid, successFunc, failureFunc) {
  const url = API_URL_V1 + 'posts';
  const authHeader = localStorage.getItem("Authorization");
  const body = {
    id: postGuid
  };

  const options = {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    }
  };

  fetch(url).then(function (response) {
    // success
    successFunc(response.json());
  }).catch(function (err) {
    // failure
    failureFunc(err);
  });
}

/* Facilitates creating a comment */
function createComment(commentBody, successFunc, failureFunc) {
  const url = API_URL_V1 + 'comments';
  const authHeader = localStorage.getItem("Authorization");
  const body = {
    body: commentBody,
    author: atob(authHeader).split(';')[1]
  };

  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    }
  };

  fetch(url).then(function (response) {
    // success
    successFunc(response.json());
  }).catch(function (err) {
    // failure
    failureFunc(err);
  });
}

/* Facilitates updating a comment */
function updateComment(commentGuid, newCommentBody, successFunc, failureFunc) {
  const url = API_URL_V1 + 'comments';
  const authHeader = localStorage.getItem("Authorization");
  const body = {
    id: commentGuid,
    body: newCommentBody
  };

  const options = {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    }
  };

  fetch(url).then(function (response) {
    // success
    successFunc(response.json());
  }).catch(function (err) {
    // failure
    failureFunc(err);
  });
}

/* Facilitates getting the comments for a set of posts */
function getComments(postGuids, successFunc, failureFunc) {
  const url = API_URL_V1 + 'comments';
  const body = {
    postIds: postGuids
  };

  const options = {
    method: 'GET',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    }
  };

  fetch(url).then(function (response) {
    // success
    successFunc(response.json());
  }).catch(function (err) {
    // failure
    failureFunc(err);
  });
}

/* Facilitates deleting a comment */
function deleteComment(commentGuid, successFunc, failureFunc) {
  const url = API_URL_V1 + 'comments';
  const authHeader = localStorage.getItem("Authorization");
  const body = {
    id: commentGuid
  };

  const options = {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    }
  };

  fetch(url).then(function (response) {
    // success
    successFunc(response.json());
  }).catch(function (err) {
    // failure
    failureFunc(err);
  });
}

/* Facilitates creating a post */
function likeAPost(postGuid, successFunc, failureFunc) {
  const url = API_URL_V1 + 'likepost';
  const authHeader = localStorage.getItem("Authorization");
  const body = {
    id: postGuid
  };

  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    }
  };

  fetch(url).then(function (response) {
    // success
    successFunc(response.json());
  }).catch(function (err) {
    // failure
    failureFunc(err);
  });
}

/* Facilitates creating a post */
function likeAComment(commentGuid, successFunc, failureFunc) {
  const url = API_URL_V1 + 'likecomment';
  const authHeader = localStorage.getItem("Authorization");
  const body = {
    id: commentGuid
  };

  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    }
  };

  fetch(url).then(function (response) {
    // success
    successFunc(response.json());
  }).catch(function (err) {
    // failure
    failureFunc(err);
  });
}

/*
  Do not use this (among other items) in production,
  only for testing.
*/
function createUUID() {

  let dt = new Date().getTime();

  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  })

  return uuid;
}

function getDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth().length === 2) ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1));
  const day = (date.getDate().length === 2) ? date.getDate() : ("0" + date.getDate());
  
  return year + "-" + month + "-" + day;
}

export {
  signup,
  login,
  updateMember,
  createPost,
  updatePost,
  getPosts,
  deletePost,
  createComment,
  updateComment,
  getComments,
  deleteComment,
  likeAPost,
  likeAComment,
  logout
};
