const express = require('express');
const morgan = require('morgan');


const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError')
const errorController = require('./controllers/errorController')




const app = express();


app.use(express.json())


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
