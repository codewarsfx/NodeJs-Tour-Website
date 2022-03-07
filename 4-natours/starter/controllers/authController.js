const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const asyncErrorCatcher = require('../utils/AsyncErrorCatcher')
const UserModel = require('../Models/userModel')
const AppError = require('../utils/appError')
const sendEmail = require('../utils/email')

//private function to sign JWTs
const signJWT = async (id,response,statusCode,userData) => {
    
    
    const cookieOptions ={
        expires:new Date(Date.now() + process.env.JWT_TOKEN_EXPIRESIN * 24 * 60 * 60 * 1000),
        httpOnly:true
    }
    
    if(process.env.NODE_ENV === "production"){
        cookieOptions.secure = true 
    }  
    
 const jwtToken = await jwt.sign({id},process.env.SIGNATURE,{
        expiresIn:process.env.EXPIRY_DATE
    })
    
    if(userData) userData.password = undefined;
    
    response.cookie('jwt',jwtToken,cookieOptions)
    response.status(statusCode).json({
        message:"success",
        jwtToken,
        userData
    })
}


//signup functionality
exports.signup = asyncErrorCatcher(async (req,res)=>{
    const userData = await UserModel.create(req.body)
    
    signJWT(userData._id,res,201,userData)
    
    
    
    
})








// login functionality
exports.login = asyncErrorCatcher( async (req,res,next)=>{
    const {email, password} = req.body
    // check if there is an email and password 
    if(!email || !password) return next(new AppError("please include an email and password",401));
    //find the user with that email and confirm the password is the same as
    const userWithEmail = await UserModel.findOne({email}).select('+password')
  
    //if the password isnt correct return error .if it is send a jwt token to the client 
    if(!userWithEmail || !(await userWithEmail.comparePasswords(req.body.password,userWithEmail.password))){   
    return next(new AppError('you have entered an incorrect email or password ',401)) 
    }

 ;
    signJWT(userWithEmail._id,res,200,userWithEmail)

})


exports.logout = (req,res)=>{
    console.log('hy logout')
    res.cookie('jwt','chideraS',{
        expires:new Date(Date.now() + 10 * 1000),
        httpOnly:true
    })
    res.status(200).json({
        "status":"ok",
        "message" : " You have successfully logged out "
        
    })
}












//in order to protect access to certain routes there'd be some kind of protection mechanism to grant access to only protected users.
exports.protect = asyncErrorCatcher(async (req,res,next)=>{
    // the protection algorithm is as follows
   let token
    
    // 1. check if the token exists in the request header
 
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
          token = req.headers.authorization.split(' ')[1]
   }
   else if(req.cookies.jwt) token=req.cookies.jwt
   else{
        return next(new AppError('Please login to receive authorization token',401));
   }
         
    //2. verify the token and get it's payload. two kind of errors can occur in the verification stage
    const jwtTokenPayload = await jwt.verify(token,process.env.SIGNATURE)
    
    // 1. the token is expired. the next is that the token's payload has been tampered with since the last time it was signed 
    
    // After verifying the token check that the user with that token still exist in your database
    const currentUser = await UserModel.findById(jwtTokenPayload.id)
    if(!currentUser) return next(new AppError('Sorry User with that token  doesnt exist please create an account',401))
    
    
    //lastly confirm that the user passw3ord hasnt changed since the token was issued 
    
    if(currentUser.checkPasswordUpdate(jwtTokenPayload.iat)) return next(new AppError('User modified this password already',401))
    
    req.user = currentUser
    
    next()  
})


exports.protectViews= asyncErrorCatcher(async (req,res,next)=>{
   if(req.cookies.jwt){
        const token = req.cookies.jwt
        try{
        const jwtTokenPayload = await jwt.verify(token,process.env.SIGNATURE)
        const currentUser = await UserModel.findById(jwtTokenPayload.id)
        if(!currentUser) return next();

        if(currentUser.checkPasswordUpdate(jwtTokenPayload.iat)) return next();
        res.locals.user = currentUser
        return next()  
        }
        catch(error){
            return next()
        }
   }   
    
    next() 

})







// this function gives users the ability to perform  certain actions based on the role they posses 
exports.authorizeUser =([...user])=>((req,res,next)=>{
    const {role} = req.user
    if(!user.includes(role)){
        return next(new AppError('User is not Authorized to perform such an action',401)) 
    }
    next()
})






//forgot password functionality
exports.forgotPassword = asyncErrorCatcher( async (req,res,next) => {
    const {email} = req.body
    
    const userWithEmail = await UserModel.findOne({email})
    if(!userWithEmail) return next(new AppError('Sorry No user with that email exist, please create an account',404))
    
   const userToken = userWithEmail.generateResetToken()
   await userWithEmail.save({validateBeforeSave:false})
   
   const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${userToken}`
   
   try {
       await sendEmail({
       email:req.body.email,
       subject:`Password request token for ${req.body.email}`,
       message:`Please click on the link ${resetPasswordUrl} to reset your password. The reset token expires in 10 minutes`
   })
   
   res.status(200).json({
       "message":"Password reset token sent"
   })
   }
   catch(error){
       next(new AppError('An error occured in sending the password reset mail',500))
       userWithEmail.resetToken= undefined
       userWithEmail.resetTokenExpires = undefined
       
       userWithEmail({
           validateBeforeSave: false
       })
   }
   
})   




// reset password functionality
exports.resetPassword = asyncErrorCatcher(
    async (req,res,next)=>{
        
        const resetTokenUrl = crypto.createHash('sha256').update(req.params.token).digest('hex');
        
        // find user with the token and make sure the token hasnt expired yet 
        
        const userWthResetToken = await UserModel.findOne({resetToken:resetTokenUrl,resetTokenExpires:{$gt: Date.now()}})
        
        if(!userWthResetToken) return next(new AppError('Invalid password reset token', 400))
        
        //change the password and confirmpassword fields 
        userWthResetToken.password = req.body.password
        userWthResetToken.confirmPassword= req.body.confirmPassword
        userWthResetToken.resetToken = undefined
        userWthResetToken.resetTokenExpires = undefined 
        
        await userWthResetToken.save()
        
        
     signJWT(userWthResetToken._id,res,200)  
    }
)





