// packages
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet')
const rateLimiter = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const xssClean = require('xss-clean')
const preventParameterPollution = require('hpp')
const path = require('path')
const cookieParser = require('cookie-parser')
const contentSecurityPolicy = require("helmet-csp")
const compression = require('compression')



//internal project modules
const viewRouter = require('./routes/viewRoutes')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError')
const reviewRouter = require('./routes/reviewRoutes')
const bookingsRouter = require('./routes/bookingsRoute')
const errorController = require('./controllers/errorController')


 

const app = express();

//setting up the pug template 
app.set('view engine','pug')
app.set('views',path.join(__dirname,'views'))



app.use(express.static(path.join(__dirname,'public')))

/*eslint-disable*/
//set security headers 
app.use(
  helmet())




// limit the number of requests
app.use('/api',rateLimiter({
     max:100  ,
     windowMs: 60 * 60 * 1000,
     message:"Req limit reached try again in an hour",
}))


//set the amount of data to be received in the request body
app.use(express.json({limit:'10kb'}))
app.use(cookieParser())

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


//middleware for setting csp headers
app.use(
  contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'", "default.example"],
      scriptSrc: ["'self'", "js.example.com","https://js.stripe.com","https://checkout.stripe.com"],
      objectSrc: ["'none'"],
      frameSrc:["'self'","https://hooks.stripe.com","https://js.stripe.com","https://checkout.stripe.com"],
      connectSrc:["'self'","https://checkout.stripe.com","https://api.stripe.com"],
      upgradeInsecureRequests: [],
    },
    reportOnly: false,
  })
);

//middle ware for compressing application responses 
app.use(compression())

//views routes
app.use('/',viewRouter)




//api routes
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/reviews',reviewRouter)
app.use('/api/v1/bookings',bookingsRouter)
app.all('*',(req, res, next) =>{
     
     next(new AppError(`Sorry the resource ${req.originalUrl} does not exist`,404))
     
})   



//general error middleware
app.use(errorController)
module.exports = app
