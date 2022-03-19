"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAlert = exports.hideAlert = void 0;

var hideAlert = function hideAlert() {
  var el = document.querySelector('.alert');
  if (el) el.parentElement.childNodes[0].remove();
};

exports.hideAlert = hideAlert;

var createAlert = function createAlert(message, type, duration) {
  var el = "<div class='alert alert--".concat(type ? 'success' : 'error', "'>").concat(message, "</div>");
  document.querySelector("body").insertAdjacentHTML('afterbegin', el);
  window.setTimeout(hideAlert, duration);
};

exports.createAlert = createAlert;