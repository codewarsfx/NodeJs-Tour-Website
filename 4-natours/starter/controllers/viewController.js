const path = require('path')
const asyncErrorCatcher = require('../utils/AsyncErrorCatcher')
const Tour = require('../Models/tourModels')


exports.getOverview = asyncErrorCatcher(async (req,res)=>{
    const tourData = await Tour.find()
    
    res.status(200).render(path.join(__dirname,'../views/overview'),{
        title:"Tours overview page ",
        tourData
    })  
})

exports.getTour = asyncErrorCatcher(
    async (req,res)=>{
        
        const tour =await Tour.findOne({slug:req.params.slug}).populate({
            path:'reviews'
        })
       
         res.status(200).render( path.join( __dirname,'../views/tour'),{
             title: "Tour Details",
            tour}
         )   

        }
)
