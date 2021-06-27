
// const fs = require('fs')

const Tour = require('../Models/tourModels')
const ApiFeatures = require('../utils/apiFeatures')




exports.aliaseController = (req, res,next) =>{
     req.query.page= '1'
     req.query.sort ='-price'
     req.query.limit ='5'
     
     next()
}


//ROUTE HANDLERS 
exports.getTours=async (req,res)=>{

    try{
       
     const toursQueryObject = new ApiFeatures(Tour.find(),req.query)
                                                                    .filter()
                                                                    .sort()
                                                                    .fieldLimiting()
                                                                    .pagination()

    
     const toursData = await toursQueryObject
    

    //send the response 
    res.status(200).json({
        'message':"success",
        'results': toursData.length,
        "data":toursData
    })
}
catch(error){
    res.status(400).json({
        'message':"error",
        "error": error.message
    })
}
}

exports.createTour = async (req,res)=>{
    
    try{
        const createdTour = await Tour.create(req.body) 
       res.status(200).json({
           status:"success",
           data: createdTour
       })
        
    }
    catch(error){
        res.status(400).json({
            "status":"fail",
            "message":error.message
        })
    }
}

exports.getTour =async (req, res)=>{
    try{
    const TourData = await Tour.find({"_id":req.params.id})
    res.status(200).json({
        "message":"success",
        "data": TourData
    })}
    catch(error){
        console.error(error.message)
    }
}

exports.updateTour =async (req,res)=>{
    try{
        const updatedTour= await Tour.findByIdAndUpdate(req.params.id,req.body,{
           new:true,   
        })  
        res.status(201).json({
            "message": "success",
            "data": updatedTour
        })
    }
    catch(error){
        console.error(error.message)
    }
}

exports.deleteTour=async (req,res)=>{
    
        try{
            
            const deletedTour = await Tour.findByIdAndDelete(req.params.id);
            
            res.status(200).json({
                "message": "success",
                data: deletedTour
            })
            
            
        
    }
    catch(error){
        console.error(error.mesage)
    }


    
    
}
