const AsyncErrorCatcher = require('../utils/AsyncErrorCatcher');
const AppError = require('../utils/appError')
const User = require('../Models/userModel')


const cleanUpRequestBody = (body,...allowedfields)=>{
    const newBody ={}
    
    Object.keys(body).forEach(el=>{
        if (allowedfields.includes(el)) newBody[el] =body[el]
        
    })
    return newBody
    
}


exports.getUsers = AsyncErrorCatcher(
    async (req, res,next)=>{
        
        const users = await User.find()
        
        
        res.status(200).json({
            "status" :"success",
            "data" : users
        })
        
        
    }
)

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




exports.createUser = (req, res) =>{
        res.status(201).json({
        "status": "success",
        "data":"ok"
    })  
}

exports.updateUser = (req, res) =>{
            res.status(200).json({
        "status": "success",
        "data":"ok"
    })  
}

exports.deleteUser = AsyncErrorCatcher(async (req,res,next)=>{
    
    // The delete user controller doesnt delete the user from the database it only finds the user and sets it's active field to false
    await User.findByIdAndUpdate(req.user._id,{active:false})
    res.status(204).json({
        message:"User deleted",
        data:null
    })
})

exports.getUser = (req, res) =>{
               res.status(200).json({
        "status": "success",
        "data":"ok"
    }) 
}
