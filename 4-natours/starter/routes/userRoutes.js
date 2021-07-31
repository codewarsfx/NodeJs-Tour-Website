const express = require('express')


const userController = require('../controllers/userController')
const authController = require('../controllers/authController')


const Router = express.Router()

Router.post('/signup',authController.signUp)
Router.post('/login',authController.login)
Router.route('/').get(userController.getUsers).post(userController.createUser)
Router.route('/:id').patch(userController.updateUser).delete(userController.deleteUser).get(userController.getUser)

module.exports = Router;





