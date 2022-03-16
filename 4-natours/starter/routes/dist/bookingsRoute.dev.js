"use strict";

var express = require('express');

var auth = require('../controllers/authController');

var bookingsController = require('../controllers/bookingController');

var Router = express.Router();
Router.route('/bookings-sessions/:tourId').post(auth.protect, bookingsController.createSession);
module.exports = Router;