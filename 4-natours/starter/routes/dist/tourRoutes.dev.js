"use strict";

var express = require('express');

var tourController = require("../controllers/tourController");

var authController = require('../controllers/authController');

var reviewRouter = require('./reviewRoutes');

var Router = express.Router();
Router.use("/:tourid/reviews", reviewRouter);
Router.route('/top5-most-expesive-tours').get(tourController.aliaseController, tourController.getTours);
Router.route('/get-busiest-month/:year').get(authController.protect, authController.authorizeUser(['admin', 'tour-guide', 'guide']), tourController.aggregateForBusiestMonth);
Router.route('/get-tour-averages').get(tourController.aggregationPipelineForAVerages);
Router.route('/location-within/:distance/center/:latlng/unit/:mi').get(tourController.getLocationsWithinRadius);
Router.route('distanceFrom/center/:latlng/unit/:mi').get(tourController.calcDistanceFrom);
Router.route('/').get(tourController.getTours).post(authController.protect, authController.authorizeUser(['admin', 'lead-guide']), tourController.createTour);
Router.route('/:id').patch(authController.protect, authController.authorizeUser(['admin', 'lead-guide']), tourController.updateTour)["delete"](authController.protect, authController.authorizeUser(['admin', 'tour-guide']), tourController.deleteTour).get(tourController.getTour);
module.exports = Router;