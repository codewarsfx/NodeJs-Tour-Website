const express = require('express')
const reviewController = require('../controllers/reveiwController')
const authController =require('../controllers/authController')


const Router = express.Router({
    mergeParams: true
})


Router.route('/').get(authController.protect,reviewController.getReviews).post(authController.protect,authController.authorizeUser(['user']),reviewController.setBody,reviewController.createReview)
Router.route('/:id').get(reviewController.getReview).delete(reviewController.deleteReview).patch(reviewController.updateReview)



module.exports = Router