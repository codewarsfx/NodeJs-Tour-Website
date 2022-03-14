const asyncErrorCatcher = require('../utils/AsyncErrorCatcher')
const Tour = require('../Models/tourModels')
const stripe = require('stripe')('sk_test_51IjOtBLlSmsaw58gsTlo3DGfHO2kbkKpJb3f4dijaxKs0Xbd6vbJUudKlDzvBezpVL0dLyHFh1ECtfrMhvIGSkmn00xJPb77r9')


exports.createSession = asyncErrorCatcher( async (req,res)=>{
    
    const tour =  await Tour.findById(req.params.tourId)
    
    const session = await stripe.checkout.sessions.create({
         "cancel_url":`${req.protocol}://${req.get('host')}/tours`,
         "success_url":`${req.protocol}://${req.get('host')}/tours/${tour.slug}`,
         "client_reference_id": req.params.tourId,
         "customer_email": req.user.email,
         "payment_method_types": [
         "card"
            ],
         "line_items":[{
              amount: tour.price * 100,
              quantity: 1,
              description: tour.summary,
              images:[`https://www.natours.dev/img/tours/${tour.imageCover}`],
              name: tour.name,
              currency:'usd'
         }]     
    })
    
    console.log(session)
    
    res.status(200).json({
        "status":"ok",
        session
    })
    
})