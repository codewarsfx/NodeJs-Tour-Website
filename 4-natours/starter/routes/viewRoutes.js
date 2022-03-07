const express = require('express')
const viewController = require('../controllers/viewController')
const auth = require('../controllers/authController')

const Router= express.Router()

Router.get('/',auth.protectViews,viewController.getOverview)
Router.get('/tour/:slug',auth.protectViews,viewController.getTour)

Router.get('/login', viewController.login)



module.exports = Router