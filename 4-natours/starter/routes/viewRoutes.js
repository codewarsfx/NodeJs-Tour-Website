const express = require('express')
const viewController = require('../controllers/viewController')

const Router= express.Router()


Router.get('/', viewController.getOverview)
Router.get('/tour/:slug',viewController.getTour)

Router.get('/login', viewController.login)


module.exports = Router