"use strict";

var _login = require("./login");

var _updateUser = require("./updateUser");

var domElements = {
  emailELement: document.querySelector('#email'),
  nameELement: document.querySelector('#name'),
  passwordElement: document.querySelector('#password'),
  formElement: document.querySelector('.l'),
  formUserELement: document.querySelector('.form-user-data'),
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
    (0, _login.logoutUser)();
  });
}

if (domElements.formUserELement) {
  domElements.formUserELement.addEventListener('submit', function (e) {
    e.preventDefault();
    var nameValue = domElements.nameELement.value;
    var emailValue = domElements.emailELement.value;
    (0, _updateUser.updateUserInfo)({
      nameValue: nameValue,
      emailValue: emailValue
    });
  });
}