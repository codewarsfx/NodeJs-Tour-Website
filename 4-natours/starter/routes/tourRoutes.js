
const express = require('express')

const tourController= require(`../controllers/tourController`)


const checkBody = (req,res,next)=>{
    const {name,price} = req.body 
    
    if(!(name && price )) return res.status(400).json({
        "status": "bad request",
        "message " :" incorrect request body"
    })
    
    next()
}

const Router = express.Router();
Router.param('id',(req,res,next,val)=>{
    if(val > tourController.data.length ) return res.status(404).json({
        "status":"not found ",
        "message": "resource not found "
    })
    next()
})



Router.route('/').get(tourController.getTours).post(checkBody,tourController.createTour)
Router.route('/:id').patch(tourController.updateTour).delete(tourController.deleteTour).get(tourController.getTour)


module.exports =Router









