"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSetting = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _alert = require("./alert");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var updateSetting = function updateSetting(userInfo, type) {
  var url, data, res;
  return regeneratorRuntime.async(function updateSetting$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          url = "/api/v1/users/".concat(type === "password" ? "updatePassword" : "updateSelf");
          data = type === "password" ? {
            currentPassword: userInfo.currentPassword,
            newPassword: userInfo.newPassword,
            confirmPassword: userInfo.confirmPassword
          } : {
            email: userInfo.emailValue,
            name: userInfo.nameValue
          };
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'patch',
            url: url,
            data: data
          }));

        case 5:
          res = _context.sent;

          if (res.data.message) {
            (0, _alert.createAlert)("".concat(type, " successfully updated"), true);
            location.reload(true);
          }

          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](2);
          (0, _alert.createAlert)("".concat(_context.t0.response.data.message), false);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 9]]);
};

exports.updateSetting = updateSetting;