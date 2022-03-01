"use strict";

var express = require('express');

var viewController = require('../controllers/viewController');

var Router = express.Router();
Router.get('/', viewController.getOverview);
Router.get('/:slug', viewController.getTour);
module.exports = Router;