"use strict";

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var jwt = require('jsonwebtoken');

var crypto = require('crypto');

var asyncErrorCatcher = require('../utils/AsyncErrorCatcher');

var UserModel = require('../Models/userModel');

var AppError = require('../utils/appError');

var Email = require('../utils/email'); //private function to sign JWTs


var signJWT = function signJWT(id, response, statusCode, userData) {
  var cookieOptions, jwtToken;
  return regeneratorRuntime.async(function signJWT$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          cookieOptions = {
            expires: new Date(Date.now() + process.env.JWT_TOKEN_EXPIRESIN * 24 * 60 * 60 * 1000),
            httpOnly: true
          };

          if (process.env.NODE_ENV === "production") {
            cookieOptions.secure = true;
          }

          _context.next = 4;
          return regeneratorRuntime.awrap(jwt.sign({
            id: id
          }, process.env.SIGNATURE, {
            expiresIn: process.env.EXPIRY_DATE
          }));

        case 4:
          jwtToken = _context.sent;
          if (userData) userData.password = undefined;
          response.cookie('jwt', jwtToken, cookieOptions);
          response.status(statusCode).json({
            message: "success",
            jwtToken: jwtToken,
            userData: userData
          });

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
}; //signup functionality


exports.signup = asyncErrorCatcher(function _callee(req, res) {
  var userData, url;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(UserModel.create(req.body));

        case 2:
          userData = _context2.sent;
          url = "".concat(req.protocol, "://").concat(req.get('host'), "/me");
          _context2.next = 6;
          return regeneratorRuntime.awrap(new Email(userData, url).sendWelcome());

        case 6:
          signJWT(userData._id, res, 201, userData);

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // login functionality

exports.login = asyncErrorCatcher(function _callee2(req, res, next) {
  var _req$body, email, password, userWithEmail;

  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, password = _req$body.password; // check if there is an email and password 

          if (!(!email || !password)) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", next(new AppError("please include an email and password", 401)));

        case 3:
          _context3.next = 5;
          return regeneratorRuntime.awrap(UserModel.findOne({
            email: email
          }).select('+password'));

        case 5:
          userWithEmail = _context3.sent;
          _context3.t0 = !userWithEmail;

          if (_context3.t0) {
            _context3.next = 11;
            break;
          }

          _context3.next = 10;
          return regeneratorRuntime.awrap(userWithEmail.comparePasswords(req.body.password, userWithEmail.password));

        case 10:
          _context3.t0 = !_context3.sent;

        case 11:
          if (!_context3.t0) {
            _context3.next = 13;
            break;
          }

          return _context3.abrupt("return", next(new AppError('you have entered an incorrect email or password ', 401)));

        case 13:
          ;
          signJWT(userWithEmail._id, res, 200, userWithEmail);

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  });
});

exports.logout = function (req, res) {
  res.cookie('jwt', 'chideraS', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({
    "status": "ok",
    "message": " You have successfully logged out "
  });
}; //in order to protect access to certain routes there'd be some kind of protection mechanism to grant access to only protected users.


exports.protect = asyncErrorCatcher(function _callee3(req, res, next) {
  var token, jwtTokenPayload, currentUser;
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))) {
            _context4.next = 4;
            break;
          }

          token = req.headers.authorization.split(' ')[1];
          _context4.next = 9;
          break;

        case 4:
          if (!req.cookies.jwt) {
            _context4.next = 8;
            break;
          }

          token = req.cookies.jwt;
          _context4.next = 9;
          break;

        case 8:
          return _context4.abrupt("return", next(new AppError('Please login to receive authorization token', 401)));

        case 9:
          _context4.next = 11;
          return regeneratorRuntime.awrap(jwt.verify(token, process.env.SIGNATURE));

        case 11:
          jwtTokenPayload = _context4.sent;
          _context4.next = 14;
          return regeneratorRuntime.awrap(UserModel.findById(jwtTokenPayload.id));

        case 14:
          currentUser = _context4.sent;

          if (currentUser) {
            _context4.next = 17;
            break;
          }

          return _context4.abrupt("return", next(new AppError('Sorry User with that token  doesnt exist please create an account', 401)));

        case 17:
          if (!currentUser.checkPasswordUpdate(jwtTokenPayload.iat)) {
            _context4.next = 19;
            break;
          }

          return _context4.abrupt("return", next(new AppError('User modified this password already', 401)));

        case 19:
          req.user = currentUser;
          res.locals.user = currentUser;
          next();

        case 22:
        case "end":
          return _context4.stop();
      }
    }
  });
});
exports.protectViews = asyncErrorCatcher(function _callee4(req, res, next) {
  var token, jwtTokenPayload, currentUser;
  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          console.log('hey');

          if (!req.cookies.jwt) {
            _context5.next = 21;
            break;
          }

          token = req.cookies.jwt;
          _context5.prev = 3;
          _context5.next = 6;
          return regeneratorRuntime.awrap(jwt.verify(token, process.env.SIGNATURE));

        case 6:
          jwtTokenPayload = _context5.sent;
          _context5.next = 9;
          return regeneratorRuntime.awrap(UserModel.findById(jwtTokenPayload.id));

        case 9:
          currentUser = _context5.sent;

          if (currentUser) {
            _context5.next = 12;
            break;
          }

          return _context5.abrupt("return", next());

        case 12:
          if (!currentUser.checkPasswordUpdate(jwtTokenPayload.iat)) {
            _context5.next = 14;
            break;
          }

          return _context5.abrupt("return", next());

        case 14:
          res.locals.user = currentUser;
          return _context5.abrupt("return", next());

        case 18:
          _context5.prev = 18;
          _context5.t0 = _context5["catch"](3);
          return _context5.abrupt("return", next());

        case 21:
          next();

        case 22:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[3, 18]]);
}); // this function gives users the ability to perform  certain actions based on the role they posses 

exports.authorizeUser = function (_ref) {
  var _ref2 = _toArray(_ref),
      user = _ref2.slice(0);

  return function (req, res, next) {
    var role = req.user.role;

    if (!user.includes(role)) {
      return next(new AppError('User is not Authorized to perform such an action', 401));
    }

    next();
  };
}; //forgot password functionality


exports.forgotPassword = asyncErrorCatcher(function _callee5(req, res, next) {
  var email, userWithEmail, userToken, resetPasswordUrl;
  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          email = req.body.email;
          _context6.next = 3;
          return regeneratorRuntime.awrap(UserModel.findOne({
            email: email
          }));

        case 3:
          userWithEmail = _context6.sent;

          if (userWithEmail) {
            _context6.next = 6;
            break;
          }

          return _context6.abrupt("return", next(new AppError('Sorry No user with that email exist, please create an account', 404)));

        case 6:
          userToken = userWithEmail.generateResetToken();
          _context6.next = 9;
          return regeneratorRuntime.awrap(userWithEmail.save({
            validateBeforeSave: false
          }));

        case 9:
          resetPasswordUrl = "".concat(req.protocol, "://").concat(req.get('host'), "/api/v1/users/resetPassword/").concat(userToken);
          _context6.prev = 10;
          _context6.next = 13;
          return regeneratorRuntime.awrap(new Email(userWithEmail, resetPasswordUrl).sendPasswordReset());

        case 13:
          res.status(200).json({
            "message": "Password reset token sent"
          });
          _context6.next = 22;
          break;

        case 16:
          _context6.prev = 16;
          _context6.t0 = _context6["catch"](10);
          next(new AppError('An error occured in sending the password reset mail', 500));
          userWithEmail.resetToken = undefined;
          userWithEmail.resetTokenExpires = undefined;
          userWithEmail.save({
            validateBeforeSave: false
          });

        case 22:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[10, 16]]);
}); // reset password functionality

exports.resetPassword = asyncErrorCatcher(function _callee6(req, res, next) {
  var resetTokenUrl, userWthResetToken;
  return regeneratorRuntime.async(function _callee6$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          resetTokenUrl = crypto.createHash('sha256').update(req.params.token).digest('hex'); // find user with the token and make sure the token hasnt expired yet 

          _context7.next = 3;
          return regeneratorRuntime.awrap(UserModel.findOne({
            resetToken: resetTokenUrl,
            resetTokenExpires: {
              $gt: Date.now()
            }
          }));

        case 3:
          userWthResetToken = _context7.sent;

          if (userWthResetToken) {
            _context7.next = 6;
            break;
          }

          return _context7.abrupt("return", next(new AppError('Invalid password reset token', 400)));

        case 6:
          //change the password and confirmpassword fields 
          userWthResetToken.password = req.body.password;
          userWthResetToken.confirmPassword = req.body.confirmPassword;
          userWthResetToken.resetToken = undefined;
          userWthResetToken.resetTokenExpires = undefined;
          _context7.next = 12;
          return regeneratorRuntime.awrap(userWthResetToken.save());

        case 12:
          signJWT(userWthResetToken._id, res, 200);

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  });
});
exports.updatePassword = asyncErrorCatcher(function _callee7(req, res, next) {
  var _req$body2, currentPassword, newPassword, confirmPassword, userFromDatabase;

  return regeneratorRuntime.async(function _callee7$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _req$body2 = req.body, currentPassword = _req$body2.currentPassword, newPassword = _req$body2.newPassword, confirmPassword = _req$body2.confirmPassword;
          _context8.next = 3;
          return regeneratorRuntime.awrap(UserModel.findById({
            _id: req.user.id
          }).select('+password'));

        case 3:
          userFromDatabase = _context8.sent;
          _context8.next = 6;
          return regeneratorRuntime.awrap(userFromDatabase.comparePasswords(currentPassword, userFromDatabase.password));

        case 6:
          if (_context8.sent) {
            _context8.next = 8;
            break;
          }

          return _context8.abrupt("return", next(new AppError('The current password you entered is incorrect', 401)));

        case 8:
          userFromDatabase.password = newPassword;
          userFromDatabase.confirmPassword = confirmPassword;
          _context8.next = 12;
          return regeneratorRuntime.awrap(userFromDatabase.save());

        case 12:
          signJWT(userFromDatabase._id, res, 200);

        case 13:
        case "end":
          return _context8.stop();
      }
    }
  });
});