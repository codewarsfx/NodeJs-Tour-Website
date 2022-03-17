const mongoose =require('mongoose')


const bookingsSchema = new mongoose.Schema({
    tour:{
        type: mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,"The tour field is required "]
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,"The user field is required "]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    price:{
        type:Number,
        required:[true,"The price field is required "]
    },
    paid:{
        type:Boolean,
        defailt:true
    }
})

// bookingsSchema.pre(/^find/,function(next){
    
//     this.populate('user').populate({
//         path:'tour',
//         select:'name'
//     })
    
//     next()
    
// })


const Bookings = mongoose.model('Booking',bookingsSchema)

module.exports= Bookings