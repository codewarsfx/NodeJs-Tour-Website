const express = require('express')
const viewController = require('../controllers/viewController')
const auth = require('../controllers/authController')
const bookingController = require('../controllers/bookingController')

const Router= express.Router()

Router.get('/',bookingController.createBookings,auth.protectViews,viewController.getOverview)
Router.get('/getBookings',auth.protect,viewController.getUserBookings)
Router.get('/tour/:slug',auth.protectViews,viewController.getTour)

Router.get('/login', viewController.login)
Router.get('/me', auth.protect, viewController.userAccount)



module.exports = Router