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
    ratingsQuantity:{
        type:Number,
        require:[true,"please provide a rating Quantity"]
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
    },
    difficulty: String
    
    
},{
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    }
})
//virtual properties are used to represent properties in our schema that we dont really need to save in our database ..u just need them created on the fly using database field values but dont need to persist them to your database
tourSchema.virtual('weeklyDuration').get(function(){
   return  this.duration / 7
})

//the doucment middleware represents a function that is run before the creatae or save method of a mongoose model is run..this mean u can actually perform some actions before the document is saved 


const Tour = mongoose.model('Tour',tourSchema)

module.exports = Tour 