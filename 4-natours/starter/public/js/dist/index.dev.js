"use strict";

var _login = require("./login");

var domElements = {
  emailELement: document.querySelector('#email'),
  passwordElement: document.querySelector('#password'),
  formElement: document.querySelector('.form'),
  logOut: document.querySelector('.logout')
};

if (domElements.formElement) {
  domElements.formElement.addEventListener('submit', function (e) {
    e.preventDefault();
    emailValue = domElements.emailELement.value, passwordValue = domElements.passwordElement.value;
    (0, _login.loginUser)(emailValue, passwordValue);
  });
}

if (domElements.logOut) {
  domElements.logOut.addEventListener('click', function () {
    (0, _login.logoutUser)(); // location.reload(true)
  });
}