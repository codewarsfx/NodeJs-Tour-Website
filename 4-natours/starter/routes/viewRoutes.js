const express = require('express')
const viewController = require('../controllers/viewController')
const auth = require('../controllers/authController')

const Router= express.Router()


Router.get('/', auth.protect,viewController.getOverview)
Router.get('/tour/:slug',viewController.getTour)

Router.get('/login', viewController.login)


module.exports = Router