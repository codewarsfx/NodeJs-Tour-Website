const express = require('express');

const tourController= require(`../controllers/tourController`);
const authController = require('../controllers/authController');


const Router = express.Router();
// Router.param('id', tourController.checkId)

Router.route('/top5-most-expesive-tours').get(tourController.aliaseController, tourController.getTours)
Router.route('/get-busiest-month/:year').get(tourController.aggregateForBusiestMonth)
Router.route('/get-tour-averages').get(tourController.aggregationPipelineForAVerages)
Router.route('/').get(authController.protect,tourController.getTours).post(tourController.createTour)
Router.route('/:id').patch(tourController.updateTour).delete(authController.protect,authController.authorizeUser("admin","lead-tour-guide"),tourController.deleteTour).get(tourController.getTour)


module.exports =Router









