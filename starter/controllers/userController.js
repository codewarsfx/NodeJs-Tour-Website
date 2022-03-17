const multer = require('multer')
const sharp = require('sharp')

const AsyncErrorCatcher = require('../utils/AsyncErrorCatcher');
const AppError = require('../utils/appError')
const User = require('../Models/userModel')
const controllerFactory = require('./ControllerFactory')


//multer storage configuration that configures the filename and destination of the file upload.
// const storage = multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null, 'starter/public/img/users')
//     },
//     filename:function(req,file,cb){
//         const ext = file.mimetype.split('/')[1]
//         const fileName = `user-${req.user.id}-${Date.now()}.${ext}`
//         cb(null,fileName)
//     }
// })


//define type of multer storage
const storage = multer.memoryStorage()


//multer filter object to filter out file uploads that are not images
const fileFilter = function (req,file,cb){
    if(file.mimetype.split('/')[0] != 'image'){
        cb(new AppError('Please file must be an image',401))
    }

    cb(null,true)
}



const upload = multer({storage,fileFilter})



//image processing middleware 
exports.processImage = AsyncErrorCatcher( async (req,res,next)=>{
    //process the image to a dimension of 500*500 jpeg and quality 90% of the original then save to disk
  if(!req.file) return next();
  
req.file.filename = `user-${req.user.id}-${Date.now()}.jpg`
    
  await  sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({quality:90}).toFile(`starter/public/img/users/${req.file.filename}`)  
  
  next()
})


exports.uploadImage = upload.single('photo')


//cleans up the request body to make sure only a given set of allowed fields can be updated
const cleanUpRequestBody = (body,...allowedfields)=>{
    const newBody ={}
    Object.keys(body).forEach(el=>{
        if (allowedfields.includes(el)) newBody[el] = body[el]
    })
    return newBody
}


exports.updateSelf = AsyncErrorCatcher(async (req,res,next)=>{
    //ensure the updates are not password changes 
    if(req.body.password || req.body.confirmPassword) return next(new AppError('You can perform password update on this route use /forgotPassword instead'))
    
    if(req.file){
        req.body.photo = req.file.filename
    }
    //perform updates to user updates but only to specific field
    const cleanedRequestBody = cleanUpRequestBody(req.body, "name","email","photo")
    const userUpdateObject = await User.findByIdAndUpdate(req.user._id,cleanedRequestBody,{
        runValidators:true,
        new:true
    })
    res.status(200).json({
        message:"ok",
        data: userUpdateObject
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

exports.getMe = (req,res,next )=>{
    req.params.id = req.user.id 
}


exports.createUser = (req, res,next) => next(new AppError("use the /signup route to create new users",500))
exports.getUsers = controllerFactory.getAll(User)
exports.getUser = controllerFactory.getOne(User)
exports.updateUser = controllerFactory.updateOne(User)
//admin delete user permanently from database 
exports.deleteUser = controllerFactory.deleteOne(User)


