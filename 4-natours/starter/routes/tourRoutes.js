const express = require('express');

const tourController= require(`../controllers/tourController`);
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes')


const Router = express.Router();

Router.use("/:tourid/reviews", reviewRouter)

Router.route('/top5-most-expesive-tours').get(tourController.aliaseController, tourController.getTours)
Router.route('/get-busiest-month/:year').get(authController.protect,authController.authorizeUser(['admin','tour-guide','guide']),tourController.aggregateForBusiestMonth)
Router.route('/get-tour-averages').get(tourController.aggregationPipelineForAVerages)


Router.route('/').get(tourController.getTours).post(authController.protect,authController.authorizeUser(['admin','lead-guide']),tourController.createTour)

Router.route('/:id').patch(authController.protect,authController.authorizeUser(['admin','lead-guide']),tourController.updateTour).delete(authController.protect,authController.authorizeUser(['admin','tour-guide']),tourController.deleteTour).get(tourController.getTour)




module.exports =Router

 







