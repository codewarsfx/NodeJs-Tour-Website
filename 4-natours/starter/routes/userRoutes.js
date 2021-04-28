const express = require('express')


const userController = require('../controllers/userController')

const Router = express.Router()

Router.route('/').get(userController.getUsers).post(userController.createUser)
Router.route('/:id').patch(userController.updateUser).delete(userController.deleteUser).get(userController.getUser)

module.exports = Router;





