"use strict";

var AsyncErrorCatcher = require('../utils/AsyncErrorCatcher');

var AppError = require('../utils/appError');

var User = require('../Models/userModel');

var controllerFactory = require('./ControllerFactory');

var cleanUpRequestBody = function cleanUpRequestBody(body) {
  for (var _len = arguments.length, allowedfields = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    allowedfields[_key - 1] = arguments[_key];
  }

  var newBody = {};
  console.log(Object.keys(body));
  Object.keys(body).forEach(function (el) {
    if (allowedfields.includes(el)) newBody[el] = body[el];
  });
  return newBody;
};

exports.updateSelf = AsyncErrorCatcher(function _callee(req, res, next) {
  var cleanedRequestBody, userUpdateObject;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(req.body); //ensure the updates are not password changes 

          if (!(req.body.password || req.body.confirmPassword)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", next(new AppError('You can perform password update on this route use /forgotPassword instead')));

        case 3:
          //perform updates to user updates but only to specific field
          cleanedRequestBody = cleanUpRequestBody(req.body, "name", "email");
          _context.next = 6;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user._id, cleanedRequestBody, {
            runValidators: true,
            "new": true
          }));

        case 6:
          userUpdateObject = _context.sent;
          res.status(200).json({
            message: "ok",
            data: userUpdateObject
          });

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.userDeleteSelf = AsyncErrorCatcher(function _callee2(req, res, next) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user._id, {
            active: false
          }));

        case 2:
          res.status(204).json({
            message: "User deleted",
            data: null
          });

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
});

exports.getMe = function (req, res, next) {
  req.params.id = req.user.id;
};

exports.createUser = function (req, res, next) {
  return next(new AppError("use the /signup route to create new users", 500));
};

exports.getUsers = controllerFactory.getAll(User);
exports.getUser = controllerFactory.getOne(User);
exports.updateUser = controllerFactory.updateOne(User); //admin delete user permanently from database 

exports.deleteUser = controllerFactory.deleteOne(User);