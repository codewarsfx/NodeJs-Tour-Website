"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AppError = require("../utils/appError");

var handleDevelopmentErrors = function handleDevelopmentErrors(err, req, res) {
  console.log(err); // res.status(err.statusCode).json({
  //      err,
  //      status: err.status,
  //      message: err.message,
  //      stack: err.stack
  // })
};

var handleProductionErrors = function handleProductionErrors(err, res) {
  if (err.operationalError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    res.status(500).json({
      message: "Something went very wrong",
      status: "fail"
    });
  }
};

var handleCastErrors = function handleCastErrors(error) {
  var message = "sorry  ".concat(error.path, " : ").concat(error.value, " is invalid");
  return new AppError(message, 404);
};

var handleDuplicateErrors = function handleDuplicateErrors(err) {
  var match = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  var message = "errror invalid entry ".concat(match, ". value exists already ");
  return new AppError(message, 500);
};

var handleValidationError = function handleValidationError(error) {
  var message = Object.keys(error.errors).map(function (el) {
    return error.errors[el].message;
  });
  return new AppError("The following Validation problems occured;  ".concat(message.join(".  ")), 500);
};

var handleInvalidJwtError = function handleInvalidJwtError() {
  return new AppError('Unauthorized access; Invalid token ', 401);
};

var handleTokenExpiredrrors = function handleTokenExpiredrrors() {
  return new AppError('Error, Expired Token. Please login again', 401);
}; //Global handling error middleware


module.exports = function (error, req, res, next) {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    handleDevelopmentErrors(error, res);
  } else if (process.env.NODE_ENV === "production") {
    var newError = _objectSpread({}, error);

    if (error.name === "CastError") {
      newError = handleCastErrors(error);
    }

    if (error.code === 11000) {
      newError = handleDuplicateErrors(error);
    }

    if (error.name === "ValidationError") {
      newError = handleValidationError(error);
    }

    if (error.name === "JsonWebTokenError") {
      newError = handleInvalidJwtError();
    }

    if (error.name === "TokenExpiredError") {
      newError = handleTokenExpiredrrors();
    }

    handleProductionErrors(newError, res);
  }

  next();
};