const path = require('path')
const stripe = require('stripe')
const asyncErrorCatcher = require('../utils/AsyncErrorCatcher')
const Tour = require('../Models/tourModels')
const Booking = require('../Models/bookingsModel')


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
  res
    .status(200)
    .render('tour', {
      title: `${tour.name} Tour`,
      tour,
    });
        }
)


exports.login = (req,res)=>{
    res.status(200).render('login',{
         title: `Welcome to Natours Login to Continue`,
    })
}

exports.userAccount = (req,res) =>{
    
    res.status(200).render('user',{
        title:'User account page'
    })
}

exports.getUserBookings =  asyncErrorCatcher(
    async (req,res)=>{
        
        const bookingsOnUser = await Booking.find({user:req.user.id})
        
        const tourIDs = bookingsOnUser.map(ob => ob.tour )
        const   tourData = await Tour.find({_id:{$in:tourIDs}})
        
       
        
        res.status(200).render('overview',
            {
        title:" Your Bookings ",
         tourData
    }
        )  
    } 
)

exports.showAlertMiddleWare = (req,res,next)=>{
 const {bookings} = req.query
 if(bookings){
    res.locals.alert= "You tour has been successfully booked. Check below to see list of your booked yours." 
 }  
next()
}

