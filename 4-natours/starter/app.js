const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet')
const rateLimiter = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const xssClean = require('xss-clean')
const preventParameterPollution = require('hpp')


const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError')
const errorController = require('./controllers/errorController')




const app = express();

//set security headers 
app.use(helmet())


// limit the number of requests
app.use('/api',rateLimiter({
     max:100  ,
     windowMs: 60 * 60 * 1000,
     message:"Req limit reached try again in an hour",
}))


//set the amount of data to be received in the request body
app.use(express.json({limit:'10kb'}))

//protect against nosql injection attacks 
app.use(mongoSanitize())

// protect against xss attacks
app.use(xssClean())

//prevent against parameter pollution
app.use(preventParameterPollution({
     whitelist:[
          "duration",
          "ratingsQuantity",
          "ratingsAverage",
          "maxGroupSize",
          "difficulty",
          "price"  
     ]
}))

//logger midleware
if(process.env.NODE_ENV === 'development'){     
     app.use(morgan("dev"))
}


//routes
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)
app.all('*',(req, res, next) =>{
     
     next(new AppError(`Sorry the resource ${req.originalUrl} does not exist`,404))
     
})   



//general error middleware
app.use(errorController)
module.exports = app
