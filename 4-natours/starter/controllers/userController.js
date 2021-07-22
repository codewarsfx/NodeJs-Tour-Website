const AsyncErrorCatcher = require('../utils/AsyncErrorCatcher')

exports.getUsers = AsyncErrorCatcher(
    async (req, res,next)=>{
        
        
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
