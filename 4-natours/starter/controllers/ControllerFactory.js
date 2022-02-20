
const asyncErrorCatcher = require('../utils/AsyncErrorCatcher')
const AppError = require('../utils/appError')
const ApiFeatures = require('../utils/apiFeatures')



exports.deleteOne= Doc => ( asyncErrorCatcher (async (req,res)=>{
    
            await Doc.findByIdAndDelete(req.params.id);
            
            res.status(204).json({
                "message": "success",
            })
}))


exports.getOne =  (Doc,populatePath)=>(
    asyncErrorCatcher(async (req, res, next)=>{
        
    let DataQueryObject = await Doc.findById(req.params.id)
    
    if(populatePath){
           DataQueryObject = DataQueryObject.populate({
           path:populatePath
    })
    }
 
   const Data = await DataQueryObject
    if(!Data){
        return next(new AppError("sorry the document with that ID does not exist",404))
    }
    
    res.status(200).json({
        "message":"success",
        "data": Data
    }) 
})
    
)

exports.updateOne = Doc=>(
    asyncErrorCatcher(async (req,res) =>{
        const updatedDoc= await Doc.findByIdAndUpdate(req.params.id,req.body,{
           new:true,    
        })  
        res.status(201).json({
            "message": "success",
            "data": updatedDoc
        })  
})
)


exports.createOne= Doc =>( asyncErrorCatcher(async (req,res,next) => {
       const createdDoc = await Doc.create(req.body) 
       res.status(200).json({
           status:"success",
           data: createdDoc
       })
}))

exports.getAll = Doc=>(
     asyncErrorCatcher(async (req,res,next)=>{
         
        //for nested get requests 
        let tourObject = {}
        if(req.params.tourid) tourObject = {
                tour:req.params.tourid
            }
    
     const DocQueryObject = new ApiFeatures(Doc.find(tourObject),req.query)
                                                                    .filter()
                                                                    .sort()
                                                                    .fieldLimiting()
                                                                    .pagination()
     const data = await DocQueryObject
    //send the response 
    res.status(200).json({
        'message':"success",
        'results': data.length,
        "data":data
    })
}
)
)