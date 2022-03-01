


const Tour = require('../Models/tourModels')
const asyncErrorCatcher = require('../utils/AsyncErrorCatcher')
const ControllerFactory = require("./ControllerFactory")



exports.aliaseController = (req,res,next) =>{
     req.query.page= '1'
     req.query.sort ='-price'
     req.query.limit ='5'
     next()
}


//ROUTE HANDLERS 
exports.getTours=ControllerFactory.getAll(Tour)
exports.createTour = ControllerFactory.createOne(Tour)
exports.getTour = ControllerFactory.getOne(Tour,"reviews")
exports.deleteTour = ControllerFactory.deleteOne(Tour)
exports.updateTour = ControllerFactory.updateOne(Tour)

// ('/location-within/:distance/center/:latlng/unit/:mi
exports.getLocationsWithinRadius = asyncErrorCatcher(async (req,res)=>{
    
    const {distance,latlng,mi} = req.params
    const [lat,lng] = latlng.split(",")
    
   
    const radius = mi === "mi" ? distance / 3963.2 : distance /6378.1
    const tourData = await Tour.find({
       startLocation: {
           $geoWithin :{
               $centerSphere :[[lng,lat],radius]
           }
       }
    })
    
    res.status(200).json({
        "status": "Ok",
        "data":{
            length:tourData.length,
            "data": tourData
        }
    })  
    
})


//geospatial aggregation pipeline for calculating distance of each location from a given point

exports.calcDistanceFrom = asyncErrorCatcher(async (req,res)=>{
     
// const {latlang,mi} = req.params
// const [lat, long] = latlang.split(',')
    

// const tourDistanceData = Tour.aggregate([{
//     $geoNear :{
        
//     }
// }])


// res.status(200).json({
//     "status":"ok",
//     data:{
//         data:tourDistanceData
//     }
// })   
}
)

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
