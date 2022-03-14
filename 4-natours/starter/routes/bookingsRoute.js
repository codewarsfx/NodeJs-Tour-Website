const express = require('express')
const auth = require('../controllers/authController')
const bookingsController = require('../controllers/bookingController')

const Router= express.Router()

Router.get('/bookings-sessions/:tourId',auth.protect,bookingsController.createSession)

module.exports = Router