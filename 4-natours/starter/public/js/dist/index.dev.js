"use strict";

var _login = require("./login");

var _updateUser = require("./updateUser");

var domElements = {
  emailELement: document.querySelector('#email'),
  nameELement: document.querySelector('#name'),
  passwordElement: document.querySelector('#password'),
  formElement: document.querySelector('.l'),
  formUserELement: document.querySelector('.form-user-data'),
  logOut: document.querySelector('.logout'),
  currentPasswordElement: document.querySelector('#password-current'),
  newPasswordElement: document.querySelector('#password'),
  confirmPasswordELement: document.querySelector('#password-confirm'),
  passwordFormElement: document.querySelector('.password-form'),
  fileUploadElement: document.getElementById('photo')
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
    e.preventDefault(domElements.fileUploadElement.files);
    var form = new FormData();
    form.append('nameValue', domElements.nameELement.value);
    form.append('emailValue', domElements.emailELement.value);
    form.append('photo', domElements.fileUploadElement.files[0]);
    (0, _updateUser.updateSetting)(form, 'data');
  });
}

var btn = document.querySelector('.btn-save-pass');

if (btn) {
  btn.addEventListener('click', function () {
    btn.textContent = "Updating Password...";
  });
}

if (domElements.passwordFormElement) {
  domElements.passwordFormElement.addEventListener('submit', function _callee(e) {
    var currentPassword, newPassword, confirmPassword;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            e.preventDefault();
            currentPassword = domElements.currentPasswordElement.value;
            newPassword = domElements.newPasswordElement.value;
            confirmPassword = domElements.confirmPasswordELement.value;
            _context.next = 6;
            return regeneratorRuntime.awrap((0, _updateUser.updateSetting)({
              currentPassword: currentPassword,
              newPassword: newPassword,
              confirmPassword: confirmPassword
            }, 'password'));

          case 6:
            btn.textContent = 'Save password';

          case 7:
          case "end":
            return _context.stop();
        }
      }
    });
  });
}