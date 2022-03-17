"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkoutStripe = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var checkoutStripe = function checkoutStripe(tourID) {
  var res;
  return regeneratorRuntime.async(function checkoutStripe$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'post',
            url: "/api/v1/bookings/bookings-sessions/".concat(tourID)
          }));

        case 2:
          res = _context.sent;
          window.location.replace(res.data.url);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.checkoutStripe = checkoutStripe;