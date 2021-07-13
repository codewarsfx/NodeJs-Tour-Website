
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

exports.aggregationPipelineForAVerages = async (req,res) => {
      
    try{
        
        const stats =await Tour.aggregate([
            {
                $match:{ratingsAverage:{$gte:4.5}}
            },{
                $group :{
                    _id:'$difficulty',
                    numberTours:{$sum:1},
                    numberRatings:{$sum:"$ratingsQuantity"},
                    averageRating:{$avg:"$ratingsAverage"},
                    averagePrice: {$avg:"$price"},
                    minPrice:{$min:"$price"},
                    maxPrice:{$max:"$price"}
                },
                
            },{
                $sort:{
                    averagePrice:-1
                }
            }
        ])
        
        res.status(200).json({
            "message":"success",
            "data":stats
        })
        
        
    }
    catch(error){
           res.status(404).json({
            "message":"Bad request",
            "error": error.message
        })
    
}
}

exports.aggregateForBusiestMonth = async (req,res)=>{
    
    try{
        const {params:{year}}= req
        const plan = await Tour.aggregate([
            {
                $unwind : "$startDates"
            },
            {
                $match:{startDates:{
                    $gte: new Date(`${+year}-01-01`),
                    $lte:new Date(`${+year}-12-31`)
                }}
            },
            {
                $group:{
                    _id: {
                        $month: "$startDates"
                    },
                    numberPerMonth : {
                        $sum: 1
                    },
                    names:{
                        $push : "$name"
                    }
                }
            },
            {
                $sort:{
                    numberPerMonth: -1
                }
            },
      
        ])
        
        res.status(200).json({
            "message":"success",
            "data":plan
        })
    }
    
    catch(error) {
        res.status(404).json({
            "message":"Bad request",
            "error": error.message
        })
    }
    
}
