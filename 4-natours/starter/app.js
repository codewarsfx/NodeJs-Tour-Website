const express = require('express')


const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()
const morgan = require('morgan')




// MIDDLEWARE
app.use(express.json())
app.use(morgan("dev"))
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)

module.exports = app
