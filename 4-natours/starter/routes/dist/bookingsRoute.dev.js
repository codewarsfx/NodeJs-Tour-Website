"use strict";

var express = require('express');

var auth = require('../controllers/authController');

var bookingsController = require('../controllers/bookingController');

var Router = express.Router();
Router.get('/bookings-sessions/:tourId', auth.protect, bookingsController.createSession);
module.exports = Router;