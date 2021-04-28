
const express = require('express')


const tourController= require(`../controllers/tourController`)




const Router = express.Router();

Router.route('/').get(tourController.getTours).post(tourController.createTour)
Router.route('/:id').patch(tourController.updateTour).delete(tourController.deleteTour).get(tourController.getTour)


module.exports =Router









