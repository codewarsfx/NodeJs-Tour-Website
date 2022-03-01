"use strict";

var _this = void 0;

var mongoose = require('mongoose');

var validator = require('validator');

var bcrypt = require('bcrypt');

var crypto = require('crypto');

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name field is required "]
  },
  email: {
    type: String,
    required: [true, "The email field is required "],
    validate: [validator.isEmail, "please enter a valid email address"],
    unique: true,
    lowercase: true
  },
  photo: String,
  password: {
    type: String,
    required: [true, "The password field is required"],
    minlength: 8,
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, "This field is required"],
    validate: {
      validator: function validator(entry) {
        return this.password === entry;
      },
      message: "doesnt match entered password "
    }
  },
  passwordChangedAt: Date,
  role: {
    type: String,
    "enum": ["admin", 'user', 'lead-guide', 'guide'],
    required: [true, 'Please assign a role to the user']
  },
  resetToken: String,
  resetTokenExpires: Date,
  active: {
    type: Boolean,
    "default": true
  }
});
userSchema.pre("save", function _callee(next) {
  var encryptedPassword;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (this.isModified('password')) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", next());

        case 2:
          _context.next = 4;
          return regeneratorRuntime.awrap(bcrypt.hash(this.password, 12));

        case 4:
          encryptedPassword = _context.sent;
          this.password = encryptedPassword;
          this.confirmPassword = undefined;
          next();

        case 8:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
});
userSchema.pre("save", function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre(/^find/, function (next) {
  this.find({
    active: {
      $ne: false
    }
  });
  next();
});

userSchema.methods.comparePasswords = function _callee2(newPassword, originalPassword) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(bcrypt.compare(newPassword, originalPassword));

        case 2:
          return _context2.abrupt("return", _context2.sent);

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
};

userSchema.methods.checkPasswordUpdate = function (JWTTimeStamp) {
  if (_this.passwordChangedAt) {
    var passwordChangedAtTimeStamp = parseInt(_this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimeStamp < passwordChangedAtTimeStamp;
  }

  return false;
};

userSchema.methods.generateResetToken = function () {
  var tokenString = crypto.randomBytes(32).toString('hex');
  this.resetToken = crypto.createHash('sha256').update(tokenString).digest('hex');
  this.resetTokenExpires = Date.now() + 10 * 60 * 1000;
  return tokenString;
};

var UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;