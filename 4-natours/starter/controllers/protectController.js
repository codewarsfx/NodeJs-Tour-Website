const {promisify} = require('util')
const jwtToken = require('jsonwebtoken')


const User = require('../Models/userModel')
const AsyncErrorCatcher = require('../utils/AsyncErrorCatcher')
const AppError = require('../utils/appError')


exports.protect = AsyncErrorCatcher(async (req,res,next)=>{
    
    console.log(req.headers.authorization)
    
    //check if there is a jwt token in the request header
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')){
        return next(new AppError('please login to gain access to this resource',401))
    }
   const token = req.headers.authorization.split(' ')[1]
   const decoded  = await  promisify(jwtToken.verify)(token, process.env.JWT_SECRET_PHRASE)
   
    
    
    //check if the user for that jwt token still exists
    const newUser = await User.findById(decoded.id)
    if(!newUser){
        return  next(new AppError('the user with this token does not exist ', 401))
    }
    
    
    //check if the password of the user has changed since the token was issued S
    
    if(await newUser.comparePasswordDates(decoded.iat)){
        return next(new AppError('The user with this token has updated his Password'),401)
    }
    
    
    req.user = newUser
    
    
    next()
})