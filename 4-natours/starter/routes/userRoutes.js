const express = require('express')


const userController = require('../controllers/userController')
const authController = require('../controllers/authController')



const Router = express.Router()

Router.route("/signup").post(authController.signup)
Router.route("/login").post(authController.login)
Router.route("/logOut").get(authController.logout)
Router.route("/forgotPassword").post(authController.forgotPassword)
Router.route("/resetPassword/:token").patch(authController.resetPassword)


//only authenticated users can access the following routes 
Router.use(authController.protect)
Router.route("/updateSelf").patch(userController.updateSelf)
Router.route("/userDeleteSelf").delete(userController.deleteUser) 
Router.route("/me").delete(userController.getMe,userController.getUser) 
Router.route("/updatePassword").patch(authController.updatePassword)


//only authorized users i.e admin can access this routes
Router.use(authController.authorizeUser(['admin']))
Router.route('/').get(userController.getUsers).post(userController.createUser)
Router.route('/:id').patch(userController.updateUser).delete(userController.deleteUser).get(userController.getUser)

module.exports = Router;





