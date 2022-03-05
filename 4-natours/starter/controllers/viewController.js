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
    
    async (req,res,next)=>{
        const tour =await Tour.findOne({slug:req.params.slug}).populate({
            path:'reviews'
        })  
  res
    .status(200)
    .render('tour', {
      title: `${tour.name} Tour`,
      tour,
    });
    
    next()
        }
)


exports.login = (req,res)=>{
    res.status(200).render('login',{
         title: `Welcome to Natours Login to Continue`,
    })
    
    console.log(req.cookies)
    
}