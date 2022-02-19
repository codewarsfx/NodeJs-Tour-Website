const express = require('express')
const reviewController = require('../controllers/reveiwController')
const authController =require('../controllers/authController')


const Router = express.Router()


Router.route('/').get(authController.protect,reviewController.getReviews).post(authController.protect,authController.authorizeUser(['user']),reviewController.createReview)
Router.route('/:id').get(reviewController.getReview)


module.exports = Router