"use strict";

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
          console.log(res);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

document.querySelector('form').addEventListener('submit', function (e) {
  e.preventDefault();
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  loginUser(email, password);
});