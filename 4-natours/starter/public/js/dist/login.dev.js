"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logoutUser = exports.loginUser = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _alert = require("./alert");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*eslint-disable*/
var loginUser = function loginUser(email, password) {
  var res;
  return regeneratorRuntime.async(function loginUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'post',
            url: '/api/v1/users/login',
            data: {
              email: email,
              password: password
            }
          }));

        case 3:
          res = _context.sent;

          if (res.data.message) {
            (0, _alert.createAlert)("successfully logged in", true);
            window.setTimeout(function () {
              location.assign('/');
            }, 150);
          }

          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          (0, _alert.createAlert)(_context.t0.response.data.message, false);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.loginUser = loginUser;

var logoutUser = function logoutUser() {
  var res;
  return regeneratorRuntime.async(function logoutUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'get',
            url: '/api/v1/users/logOut'
          }));

        case 3:
          res = _context2.sent;

          if (res.data.message) {
            location.reload(true);
          }

          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          (0, _alert.createAlert)('error logging out', false);

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.logoutUser = logoutUser;