"use strict";

var _login = require("./login");

var _updateUser = require("./updateUser");

var _stripe = require("./stripe");

var _alert = require("./alert");

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
  fileUploadElement: document.getElementById('photo'),
  buttonElement: document.querySelector('.checkout-button')
};

if (domElements.buttonElement) {
  domElements.buttonElement.addEventListener('click', function _callee(e) {
    var tourID;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            e.target.textContent = 'processing...';
            tourID = domElements.buttonElement.dataset.tour;
            _context.next = 4;
            return regeneratorRuntime.awrap((0, _stripe.checkoutStripe)(tourID));

          case 4:
            e.target.textContent = 'Book a Tour ';

          case 5:
          case "end":
            return _context.stop();
        }
      }
    });
  });
}

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
  domElements.passwordFormElement.addEventListener('submit', function _callee2(e) {
    var currentPassword, newPassword, confirmPassword;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            e.preventDefault();
            currentPassword = domElements.currentPasswordElement.value;
            newPassword = domElements.newPasswordElement.value;
            confirmPassword = domElements.confirmPasswordELement.value;
            _context2.next = 6;
            return regeneratorRuntime.awrap((0, _updateUser.updateSetting)({
              currentPassword: currentPassword,
              newPassword: newPassword,
              confirmPassword: confirmPassword
            }, 'password'));

          case 6:
            btn.textContent = 'Save password';

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
}

var showAlert = function showAlert() {
  var alert;
  return regeneratorRuntime.async(function showAlert$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          alert = document.querySelector('body').dataset.alert;

          if (!alert) {
            _context3.next = 5;
            break;
          }

          _context3.next = 4;
          return regeneratorRuntime.awrap((0, _alert.createAlert)(alert, true, 5000));

        case 4:
          document.querySelectr('body').dataset.alert = '';

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
};

showAlert();