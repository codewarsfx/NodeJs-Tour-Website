"use strict";

// packages
var express = require('express');

var morgan = require('morgan');

var helmet = require('helmet');

var rateLimiter = require('express-rate-limit');

var mongoSanitize = require('express-mongo-sanitize');

var xssClean = require('xss-clean');

var preventParameterPollution = require('hpp');

var path = require('path');

var cookieParser = require('cookie-parser');

var contentSecurityPolicy = require("helmet-csp");

var compression = require('compression');

var cors = require('cors'); //internal project modules


var viewRouter = require('./routes/viewRoutes');

var tourRouter = require('./routes/tourRoutes');

var userRouter = require('./routes/userRoutes');

var AppError = require('./utils/appError');

var reviewRouter = require('./routes/reviewRoutes');

var bookingsRouter = require('./routes/bookingsRoute');

var errorController = require('./controllers/errorController');

var bookingController = require('./controllers/bookingController');

var app = express(); //to enable checking the headers for a secure connection via heroku 

app.enable('trust proxy'); //enable cors for both the api and views

app.use(cors()); //enable cors special req verbs

app.options('*', cors()); //setting up the pug template 

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express["static"](path.join(__dirname, 'public')));
/*eslint-disable*/
//set security headers 

app.use(helmet()); // limit the number of requests

app.use('/api', rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Req limit reached try again in an hour"
}));
app.post('/createWebHook', express.raw({
  type: 'application/json'
}), bookingController.webHookBookings); //set the amount of data to be received in the request body

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
} //middleware for setting csp headers


app.use(contentSecurityPolicy({
  useDefaults: true,
  directives: {
    defaultSrc: ["'self'", "default.example"],
    scriptSrc: ["'self'", "js.example.com", "https://js.stripe.com", "https://checkout.stripe.com"],
    objectSrc: ["'none'"],
    frameSrc: ["'self'", "https://hooks.stripe.com", "https://js.stripe.com", "https://checkout.stripe.com"],
    connectSrc: ["'self'", "https://checkout.stripe.com", "https://api.stripe.com"],
    upgradeInsecureRequests: []
  },
  reportOnly: false
})); //middle ware for compressing application responses 

app.use(compression()); //views routes

app.use('/', viewRouter); //api routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingsRouter);
app.all('*', function (req, res, next) {
  next(new AppError("Sorry the resource ".concat(req.originalUrl, " does not exist"), 404));
}); //general error middleware

app.use(errorController);
module.exports = app;