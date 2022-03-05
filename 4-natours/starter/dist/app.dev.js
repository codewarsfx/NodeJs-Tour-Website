"use strict";

var _directives;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// packages
var express = require('express');

var morgan = require('morgan');

var helmet = require('helmet');

var rateLimiter = require('express-rate-limit');

var mongoSanitize = require('express-mongo-sanitize');

var xssClean = require('xss-clean');

var preventParameterPollution = require('hpp');

var path = require('path');

var cookieParser = require('cookie-parser'); //internal project modules


var viewRouter = require('./routes/viewRoutes');

var tourRouter = require('./routes/tourRoutes');

var userRouter = require('./routes/userRoutes');

var AppError = require('./utils/appError');

var reviewRouter = require('./routes/reviewRoutes');

var errorController = require('./controllers/errorController');

var app = express(); //setting up the pug template 

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express["static"](path.join(__dirname, 'public')));
/*eslint-disable*/
//set security headers 

app.use(helmet.contentSecurityPolicy({
  directives: (_directives = {
    defaultSrc: ["'self'", 'data:', 'blob:'],
    fontSrc: ["'self'", 'https:', 'data:'],
    scriptSrc: ["'self'", 'unsafe-inline']
  }, _defineProperty(_directives, "scriptSrc", ["'self'", 'https://*.cloudflare.com']), _defineProperty(_directives, "scriptSrcElem", ["'self'", 'https:', 'https://*.cloudflare.com']), _defineProperty(_directives, "styleSrc", ["'self'", 'https:', 'unsafe-inline']), _defineProperty(_directives, "connectSrc", ["'self'", 'data', 'https://*.cloudflare.com']), _directives)
})); // limit the number of requests

app.use('/api', rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Req limit reached try again in an hour"
})); //set the amount of data to be received in the request body

app.use(express.json({
  limit: '10kb'
}));
app.use(cookieParser()); //protect against nosql injection attacks 

app.use(mongoSanitize()); // protect against xss attacks

app.use(xssClean()); //prevent against parameter pollution

app.use(preventParameterPollution({
  whitelist: ["duration", "ratingsQuantity", "ratingsAverage", "maxGroupSize", "difficulty", "price"]
})); //logger midleware

if (process.env.NODE_ENV === 'development') {
  app.use(morgan("dev"));
} //views routes


app.use('/', viewRouter); //api routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.all('*', function (req, res, next) {
  next(new AppError("Sorry the resource ".concat(req.originalUrl, " does not exist"), 404));
}); //general error middleware

app.use(errorController);
module.exports = app;