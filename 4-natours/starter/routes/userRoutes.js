const express = require('express')


const userController = require('../controllers/userController')
const authController = require('../controllers/authController')



const Router = express.Router()

Router.route("/signup").post(authController.signup)
Router.route("/login").post(authController.login)
Router.route("/forgotPassword").post(authController.forgotPassword)
Router.route("/resetPassword/:token").patch(authController.resetPassword)
Router.route("/updateSelf").patch(authController.protect,userController.updateSelf)
Router.route("/userDeleteSelf").delete(authController.protect,userController.deleteUser)



Router.route('/').get(userController.getUsers).post(userController.createUser)
Router.route('/:id').patch(userController.updateUser).delete(userController.deleteUser).get(userController.getUser)

module.exports = Router;





