const express = require('express');

const tourController= require(`../controllers/tourController`);
const authController = require('../controllers/authController');

const reviewRouter = require('./reviewRoutes')


const Router = express.Router();

Router.use("/:tourid/reviews", reviewRouter)


Router.route('/top5-most-expesive-tours').get(tourController.aliaseController, tourController.getTours)
Router.route('/get-busiest-month/:year').get(tourController.aggregateForBusiestMonth)
Router.route('/get-tour-averages').get(tourController.aggregationPipelineForAVerages)
Router.route('/').get(authController.protect,tourController.getTours).post(tourController.createTour)
Router.route('/:id').patch(tourController.updateTour).delete(authController.protect,authController.authorizeUser(['admin','tour-guide']),tourController.deleteTour).get(tourController.getTour)


// Router.route("/:tourid/reviews").post(authController.protect,authController.authorizeUser(['user']),reviewController.createReview)

module.exports =Router

 







