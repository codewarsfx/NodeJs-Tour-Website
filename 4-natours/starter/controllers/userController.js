const AsyncErrorCatcher = require('../utils/AsyncErrorCatcher');

const User = require('../Models/userModel')

exports.getUsers = AsyncErrorCatcher(
    async (req, res,next)=>{
        
        const users = await User.find()
        
        
        res.status(200).json({
            "status" :"success",
            "data" : users
        })
        
        
    }
)

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

exports.deleteUser = (req, res) =>{
            res.status(204).json({
        "status": "success",
        "data":"ok"
    })  
}

exports.getUser = (req, res) =>{
               res.status(200).json({
        "status": "success",
        "data":"ok"
    }) 
}
