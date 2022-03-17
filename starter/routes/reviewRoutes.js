const express = require('express')
const reviewController = require('../controllers/reveiwController')
const authController =require('../controllers/authController')


const Router = express.Router({
    mergeParams: true
})


Router.use(authController.protect)


Router.route('/').get(reviewController.getReviews).post(authController.authorizeUser(['user']),reviewController.setBody,reviewController.createReview)
Router.route('/:id').get(reviewController.getReview).delete(authController.authorizeUser(['admin','user']),reviewController.deleteReview).patch(authController.authorizeUser(['admin','user']),reviewController.updateReview)



module.exports = Router