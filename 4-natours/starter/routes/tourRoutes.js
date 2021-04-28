
const express = require('express')

const tourController= require(`../controllers/tourController`)

const Router = express.Router();
Router.param('id',(req,res,next,val)=>{
    if(val > tourController.data.length ) return res.status(404).json({
        "status":"not found ",
        "message": "resource not found "
    })
    next()
})



Router.route('/').get(tourController.getTours).post(tourController.createTour)
Router.route('/:id').patch(tourController.updateTour).delete(tourController.deleteTour).get(tourController.getTour)


module.exports =Router









