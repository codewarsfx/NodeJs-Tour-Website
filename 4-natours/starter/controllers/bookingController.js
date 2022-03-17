const asyncErrorCatcher = require('../utils/AsyncErrorCatcher')
const Tour = require('../Models/tourModels')
const Booking = require('../Models/bookingsModel')
const controllerFactory = require('./ControllerFactory')
const stripe = require('stripe')('sk_test_51IjOtBLlSmsaw58gsTlo3DGfHO2kbkKpJb3f4dijaxKs0Xbd6vbJUudKlDzvBezpVL0dLyHFh1ECtfrMhvIGSkmn00xJPb77r9')


exports.createSession = asyncErrorCatcher( async (req,res)=>{

    const tour =  await Tour.findById(req.params.tourId)
    const session = await stripe.checkout.sessions.create({
         "cancel_url":`${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
         "success_url":`${req.protocol}://${req.get('host')}/?tour=${tour._id}&user=${req.user.id}&price=${tour.price}&paid=true`,
         "client_reference_id": req.params.tourId,
         "customer_email": req.user.email,
         "payment_method_types": [
         "card"
            ],
         "line_items":[{
              amount: tour.price * 100,
              quantity: 1,
              description: tour.summary,
              images:[`https://drive.google.com/file/d/1hrVFn8DSUMOMZsh38EIW-gmXG6a3yR3r/view?usp=sharing`],
              name: tour.name,
              currency:'usd'
         }]     
    })
    
    res.status(200).json({
        "status":"ok",
        url:session.url
    })
    
})


exports.createBookings = asyncErrorCatcher(
    async (req,res,next)=>{
        const {tour,user,price,paid} = req.query
        if(!tour||!user||!price||!paid)  return next()
        
        const booking = await Booking.create({
            tour,
            user,
            price,
            paid
        })
        
        res.redirect(301,`${req.originalUrl.split('?')[0]}`)
        
         next()
    }
)


exports.getBookings = controllerFactory.getAll(Booking)
