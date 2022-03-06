"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shoutHello = exports.loginUser = void 0;

/*eslint-disable*/
var loginUser = function loginUser(email, password) {
  var res;
  return regeneratorRuntime.async(function loginUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(axios({
            method: 'post',
            url: '/api/v1/users/login',
            data: {
              email: email,
              password: password
            }
          }));

        case 3:
          res = _context.sent;
          if (res.data.sta) alert('user loggen in ');
          window.setTimeout(function () {
            location.assign('/');
          }, 150);
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.loginUser = loginUser;

var shoutHello = function shoutHello() {
  console.log('say hello from login');
};

exports.shoutHello = shoutHello;