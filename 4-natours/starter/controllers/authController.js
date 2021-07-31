
const jsonwebtoken = require('jsonwebtoken')

const AppError = require('../utils/appError')
const asyncErrorCatcher = require('../utils/AsyncErrorCatcher')
const User = require('../Models/userModel')



exports.signUp = asyncErrorCatcher(async (req,res,next)=>{
    
    const newUser = await User.create(req.body)
    
    const jwt = await jsonwebtoken.sign({id:newUser._id},process.env.JWT_SECRET_PHRASE,{expiresIn:process.env.JWT_EXPIRATION})
    

    
    res.status(201).json({
        "status":"success",
        jwt,
        "user" : newUser
    })
      
})

exports.login = asyncErrorCatcher(async (req,res,next)=>{
    
    
    const {email,password} = req.body
// 1. //check if email and password is included in the request's body 
    
    if(!email || !password){
        return next(new AppError('please provide values for email and password',401))
    }
    
    
    
// 2. find the user who has that email and confirm the paswword is the same 

   const userMatch = await User.findOne({email}).select('+password')
   if(!userMatch || !(await userMatch.comparePasswords(password,userMatch.password))){
       return next(new AppError('sorry the email and password isnt correct',403))
   }
   
   // genrate jwt token  
   const jwtToken = jsonwebtoken.sign({id:userMatch._id},process.env.JWT_SECRET_PHRASE,{expiresIn:process.env.JWT_EXPIRATION})
   
   res.status(200).json({
       "status" : "success",
       "message" : userMatch,
       jwt: jwtToken
   })
  
})