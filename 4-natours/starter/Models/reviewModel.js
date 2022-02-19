const mongoose = require('mongoose')




const reviewSchema = new mongoose.Schema({
    
    review:{
        type:String,
        required: [true, "Review can not be empty"]
    },
    rating:{
        type:Number,
        min:1, 
        max:5
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    tour:{
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required:[true,"Tours review must have a tour "]
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref: "User",
        required:[true,"review must belong to a user"]
    }
})


reviewSchema.pre(/^find/,function(next){
    
    this.populate({
          path:"user",
        select:"name"
    })
    next()
})

const reviewModel = mongoose.model("Review",reviewSchema)

module.exports = reviewModel