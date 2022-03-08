"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUserInfo = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _alert = require("./alert");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var updateUserInfo = function updateUserInfo(userInfo) {
  var res;
  return regeneratorRuntime.async(function updateUserInfo$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'patch',
            url: '/api/v1/users/updateSelf',
            data: {
              email: userInfo.emailValue,
              name: userInfo.nameValue
            }
          }));

        case 3:
          res = _context.sent;

          if (res.data.message) {
            (0, _alert.createAlert)('data successfully updated', true);
            location.reload(true);
          }

          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          (0, _alert.createAlert)("".concat(_context.t0.response.data.message), false);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.updateUserInfo = updateUserInfo;