"use strict";

var express = require('express');

var viewController = require('../controllers/viewController');

var auth = require('../controllers/authController');

var Router = express.Router();
Router.get('/', auth.protect, viewController.getOverview);
Router.get('/tour/:slug', viewController.getTour);
Router.get('/login', viewController.login);
module.exports = Router;