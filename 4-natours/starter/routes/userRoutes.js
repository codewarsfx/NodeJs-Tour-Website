const express = require('express')


const userController = require('../controllers/userController')
const authController = require('../controllers/authController')



const Router = express.Router()

Router.route("/signup").post(authController.signup)
Router.route("/login").post(authController.login)
Router.route("/forgotPassword").post(authController.forgotPassword)




Router.route('/').get(userController.getUsers).post(userController.createUser)
Router.route('/:id').patch(userController.updateUser).delete(userController.deleteUser).get(userController.getUser)

module.exports = Router;





