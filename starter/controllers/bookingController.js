const asyncErrorCatcher = require('../utils/AsyncErrorCatcher')
const Tour = require('../Models/tourModels')
const Booking = require('../Models/bookingsModel')
const User = require('../Models/userModel')
const controllerFactory = require('./ControllerFactory')
const stripe = require('stripe')('sk_test_51IjOtBLlSmsaw58gsTlo3DGfHO2kbkKpJb3f4dijaxKs0Xbd6vbJUudKlDzvBezpVL0dLyHFh1ECtfrMhvIGSkmn00xJPb77r9')


exports.createSession = asyncErrorCatcher( async (req,res)=>{

    const tour =  await Tour.findById(req.params.tourId)
    const session = await stripe.checkout.sessions.create({
         "cancel_url":`${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
         "success_url":`${req.protocol}://${req.get('host')}/getBookings/?bookings=true`,
         "client_reference_id": req.params.tourId,
         "customer_email": req.user.email,
         "payment_method_types": [
         "card"
            ],
         "line_items":[{
              amount: tour.price * 100,
              quantity: 1,
              description: tour.summary,
              images:[`${req.protocol}://${req.get('host')}/public/img/tours/${tour.imageCover}`],
              name: tour.name,
              currency:'usd'
         }]     
    })
    
    res.status(200).json({
        "status":"ok",
        url:session.url
    })
    
})


// exports.createBookings = asyncErrorCatcher(
//     async (req,res,next)=>{
//         const {tour,user,price,paid} = req.query
//         if(!tour||!user||!price||!paid)  return next()
        
//         const booking = await Booking.create({
//             tour,
//             user,
//             price,
//             paid
//         })
        
//         res.redirect(301,`${req.originalUrl.split('?')[0]}`)
        
//          next()
//     }
// )


const createBooking = async (event,res) =>{
    
    
    
    if(event.type == "checkout.session.completed"){
        
        const userId = (await User.findOne({email:event.data.object['customer_details'].email}))._id
        
        await Booking.create({
            tour:event.data.object['client_reference_id'],
            user:userId,
            price:event.data.object['amount_total']/100,
            paid: true
        })
        res.status(200).send('webhook received successfully')
        
    }
}



exports.webHookBookings= asyncErrorCatcher(
    async (req,res)=>{
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

        let event = req.body
        
        if(endpointSecret){
            const signature = req.headers['stripe-signature']

            try{
                event=stripe.webhooks.constructEvent(
                    req.body,
                    signature,
                    endpointSecret
                )
                
                createBooking(event,res)
            }
            catch(error){
                console.log('sorry webhook signature verification failed.',error.message)
                res.status(400).send(error.message)
            }
        }  
        
    }
)

exports.getBookings = controllerFactory.getAll(Booking)
