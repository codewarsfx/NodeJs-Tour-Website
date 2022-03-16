const express = require('express')
const auth = require('../controllers/authController')
const bookingsController = require('../controllers/bookingController')

const Router= express.Router()

Router.route('/bookings-sessions/:tourId').post(auth.protect,bookingsController.createSession)

module.exports = Router