


const Tour = require('../Models/tourModels')
const asyncErrorCatcher = require('../utils/AsyncErrorCatcher')
const ControllerFactory = require("./ControllerFactory")
const multer = require('multer')
const sharp = require('sharp')
const AppError = require('../utils/appError')


const storage = multer.memoryStorage()
const fileFilter = function (req,file,cb){
    console.log(req)
    
    if(!file.mimetype.startsWith('image')) return cb(new AppError('Error Only images can be uploaded pleas',401));
    
    
    cb(null,true)
    
}

const upload = multer(storage,fileFilter)


exports.uploadTours = upload.fields([{
    name:'imageCover',maxCount:1
},{
    name:"images",
    maxCount:"3"
}])



    exports.processTourImagesUploaded = asyncErrorCatcher(async (req,res,next)=>{ 
        
        console.log('hello')
        
        if(!req.files) return next()
      
        req.body.imageCover = `tour-${req.params.id}-${Date.now()}.jpg`
         await sharp(req.files.imageCover[0].buffer).resize(2000,1333).toFormat('jpeg').jpeg({quality:90}).toFile(`starter/public/img/tours/${req.body.imageCover}`)
      
      
      req.body.images =[]

     await Promise.all(req.files.images.map(async (file,index)=>{
          
        const filename = `tour-${req.params.id}-${Date.now()}-${index + 1}.jpg`
        req.body.images.push(filename) 
        return  await sharp(file.buffer).resize(2000,1333).toFormat('jpeg').jpeg({quality:90}).toFile(`starter/public/img/tours/${filename}`) 
      }))
      
      console.log(req.body)
        
        next()
        
    })


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
