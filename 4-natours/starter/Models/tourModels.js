const mongoose = require('mongoose')


// Schema and model for tour data
const tourSchema = new mongoose.Schema({
    name: {
        type:String,
        unique:true,
        required:[true,"a Name is required "],
        trim:true
    },
    duration:{
        type:Number,
        required:[true,"a duration is required"]
    },
    rating: {
        type:Number,
        default:4.5
    },
    price: {
        type:Number,
        required:[true,"A price value must be presented"]
    },
    priceDiscount:Number,
    summary:{
        type:String,
        trim: true,
        required:[true,'A summary is required ']
    },
    description:{
        type:String,
        trim: true,
        required:[true,'A description is required ']
    },
    createdAt :{
        type:Date,
        default: Date.now()
    },
    startDates:{
        type:[Date],
        default:[true,'an array of start dates is required ']
        
    },
    ratingsAverage:{
        type: Number,
        required:[true," ratings average must be provided"],
        default : 4.5   
    },
    imageCover:{
        type:String,
        required: [true,"there must be an image cover "]
    },
    images:{
        type:[String],
        required:[true,'an array of images is required']
    }
    
    
})

const Tour = mongoose.model('Tour',tourSchema)

module.exports = Tour 