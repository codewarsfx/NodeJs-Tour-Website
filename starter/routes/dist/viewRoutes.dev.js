"use strict";

var express = require('express');

var viewController = require('../controllers/viewController');

var auth = require('../controllers/authController');

var Router = express.Router();
Router.use(viewController.showAlertMiddleWare);
Router.get('/getBookings', auth.protect, viewController.getUserBookings);
Router.get('/', auth.protectViews, viewController.getOverview);
Router.get('/tour/:slug', auth.protectViews, viewController.getTour);
Router.get('/login', viewController.login);
Router.get('/me', auth.protect, viewController.userAccount);
module.exports = Router;