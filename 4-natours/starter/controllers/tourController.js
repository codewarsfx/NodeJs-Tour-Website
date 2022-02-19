


const Tour = require('../Models/tourModels')
const ApiFeatures = require('../utils/apiFeatures')
const asyncErrorCatcher = require('../utils/AsyncErrorCatcher')
const AppError = require('../utils/appError')



exports.aliaseController = (req,res,next) =>{
     req.query.page= '1'
     req.query.sort ='-price'
     req.query.limit ='5'
     next()
}


//ROUTE HANDLERS 
exports.getTours= asyncErrorCatcher(async (req,res,next)=>{
    
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
)


exports.createTour = asyncErrorCatcher(async (req,res,next) => {
       const createdTour = await Tour.create(req.body) 
       res.status(200).json({
           status:"success",
           data: createdTour
       })
})



exports.getTour =asyncErrorCatcher(async (req, res,next)=>{
    const TourData = await Tour.findById(req.params.id).populate({
        path:"reviews"
    })
   
    if(!TourData){
        return next(new AppError("sorry the tour with that ID does not exist",404))
    }
    
    res.status(200).json({
        "message":"success",
        "data": TourData
    }) 
})

exports.updateTour =asyncErrorCatcher(async (req,res) =>{
        const updatedTour= await Tour.findByIdAndUpdate(req.params.id,req.body,{
           new:true,    
        })  
        res.status(201).json({
            "message": "success",
            "data": updatedTour
        })  
})

exports.deleteTour=asyncErrorCatcher(async (req,res)=>{
    
            await Tour.findByIdAndDelete(req.params.id);
            
            res.status(204).json({
                "message": "success",
            })
})


exports.aggregationPipelineForAVerages = asyncErrorCatcher(async (req,res) => {
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
})

exports.aggregateForBusiestMonth = asyncErrorCatcher(async (req,res)=>{
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
})
