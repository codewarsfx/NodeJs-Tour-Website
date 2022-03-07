"use strict";

var express = require('express');

var viewController = require('../controllers/viewController');

var auth = require('../controllers/authController');

var Router = express.Router();
Router.get('/', auth.protectViews, viewController.getOverview);
Router.get('/tour/:slug', auth.protectViews, viewController.getTour);
Router.get('/login', viewController.login);
module.exports = Router;