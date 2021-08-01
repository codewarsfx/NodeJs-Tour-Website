
const jsonwebtoken = require('jsonwebtoken')
const {promisify} = require('util')


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
       jwt: jwtToken
   })
  
})



exports.protect = asyncErrorCatcher(async (req,res,next)=>{
    //check if there is a jwt token in the request header
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')){
        return next(new AppError('please login to gain access to this resource',401))
    }
   const token = req.headers.authorization.split(' ')[1]
   const decoded  = await  promisify(jsonwebtoken.verify)(token, process.env.JWT_SECRET_PHRASE)
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



exports.authorizeUser = (...roles)=> ((req,res,next) =>{
  
        // get current user role
        
        const currentUserRole = req.user.role
        
    
        if (!roles.includes(currentUserRole)){
            return next(new AppError('sorry you are not authorized to perform such action',403))
        }
        
         
        //throw error or return to next middleware  
        
        next()
        
        
        
    })
