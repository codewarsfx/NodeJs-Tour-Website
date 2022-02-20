const AsyncErrorCatcher = require('../utils/AsyncErrorCatcher');
const AppError = require('../utils/appError')
const User = require('../Models/userModel')
const controllerFactory = require('./ControllerFactory')


const cleanUpRequestBody = (body,...allowedfields)=>{
    const newBody ={}
    
    Object.keys(body).forEach(el=>{
        if (allowedfields.includes(el)) newBody[el] =body[el]
        
    })
    return newBody
    
}


exports.updateSelf = AsyncErrorCatcher(async (req,res,next)=>{
    //ensure the updates are not password changes 
    if(req.body.password || req.body.confirmPassword) return next(new AppError('You can perform password update on this route use /forgotPassword instead'))
    //perform updates to user updates but only to specific field
    const cleanedRequestBody = cleanUpRequestBody(req.body, "name","email")
    const userUpdateObject = await User.findByIdAndUpdate(req.user._id,cleanedRequestBody,{
        runValidators:true,
        new:true
    })
    res.status(200).json({
        message:"ok",
        userUpdateObject
    })
    
})

exports.userDeleteSelf = AsyncErrorCatcher(async (req,res,next)=>{
    
    // The delete user controller doesnt delete the user from the database it only finds the user and sets it's active field to false
    await User.findByIdAndUpdate(req.user._id,{active:false})
    res.status(204).json({
        message:"User deleted",
        data:null
    })
})




exports.createUser = (req, res,next) => next(new AppError("use the /signup route to create new users",500))
exports.getUsers = controllerFactory.getAll(User)
exports.getUser = controllerFactory.getOne(User)
exports.updateUser = controllerFactory.updateOne(User)
//admin delete user permanently from database 
exports.deleteUser = controllerFactory.deleteOne(User)


