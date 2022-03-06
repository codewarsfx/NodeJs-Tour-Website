"use strict";

var _login = require("./login");

var formElement = document.querySelector('form');

if (formElement) {
  formElement.addEventListener('submit', function (e) {
    e.preventDefault();
    var inputEmail = document.getElementById('email');
    var inputPassword = document.getElementById('password');

    if (inputEmail && inputPassword) {
      var email = inputEmail.value;
      var password = inputPassword.value;
      loginUser(email, password);
    }
  });
}

console.log('hey');
(0, _login.shoutHello)();