const mongoose = require('mongoose')

const Tour = require('./tourModels')




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


reviewSchema.index(
    {
        user: 1,
        tour: 1
    }
    ,{
        unique: true 
    }
)


reviewSchema.statics.getReviewStats =async  function (tourID){
    //an aggregation pipeline that calculates the average rating for a particular tour and the number of reviews.
    const stats = await this.aggregate([{
        $match:{
            tour: tourID
        },
    },{
        $group:{
            _id : '$tour',
            ratingsAverage : {
                $avg:'$rating',            
            },
            ratingsQuantity:{
                $sum: 1
            }
        }
    }])

    if(stats){
         await Tour.findByIdAndUpdate(tourID,{
         ratingsAverage: Math.round(stats[0].ratingsAverage * 10) / 10,
         ratingsQuantity:stats[0].ratingsQuantity
    })
    }
    else{
          await Tour.findByIdAndUpdate(tourID,{
         ratingsAverage: 4.5,
         ratingsQuantity:0
    })
    }  
}


reviewSchema.post('save', function(){
    this.constructor.getReviewStats(this.tour) 
    
})


reviewSchema.pre(/^findOneAnd/,async function(next){
    this.r = await this.findOne()
    next()
})


reviewSchema.post(/^findOneAnd/, async function(){
    
    
 await  this.r.constructor.getReviewStats(this.r.tour)
    
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