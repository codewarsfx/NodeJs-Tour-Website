const mongoose = require('mongoose');

const slugify = require('slugify')
// const Review = require('./reviewModel')

// Schema and model for tour data
const tourSchema = new mongoose.Schema({
    name: {
        type:String,
        unique:true,
        required:[true,"a Name is required "],
        trim:true
    },
    maxGroupSize:Number,
    duration:{
        type:Number,
        required:[true,"a duration is required"]
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
        required:[true,'an array of start dates is required ']   
    },
    secretTours:Boolean,
    slug:String,
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
    difficulty: String,
    startLocation:{
        type:{
            type: String,
            enum:["Point"],
            default:"Point",
            
        },
        coordinates:{
            type:[Number],
            description:String,
            address:String,   
        },
        description:String,
        address: String,
        
    },
    locations:[
{
    type:{
            type: String,
            enum:["Point"],
            default:"Point"
    },
    coordinates: {
            type:[Number],
        },
    description:String,
    address:String, 
    day:Number   
}
    ],
    guides:[
        {
            type: mongoose.Schema.ObjectId,
            ref: "User" 
        }
    ]
},{
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    }
})

tourSchema.index({
    price:1,
    rating: 1,
    slug: 1
})
tourSchema.index({
    startLocation: "2dsphere"
})
// tourSchema.pre('save',async function(next){
    
//     const guidesPromise = this.guides.map(async (id) =>await User.findById(id))
    
//      this.guides=await Promise.all(guidesPromise)
   
//     next()
// })

// virtual properties are used to represent properties in our schema that we dont really need to save in our database ..u just need them created on the fly using database field values but dont need to persist them to your database
tourSchema.virtual('weeklyDuration').get(function(){
   return  this.duration / 7
})


//virtual property to populate the tour object with reviews 
tourSchema.virtual('reviews', { 
    ref: "Review",
    foreignField:"tour",
    localField:"_id"
})

//the doucment middleware represents a function that is run before the creatae or save method of a mongoose model is run..this mean u can actually perform some actions before the document is saved
tourSchema.pre('save',function(next){
    this.slug= slugify(this.name,{
        lowercase:true
    })
    next()
})


// query selector to populate guides arraay during query 
tourSchema.pre(/^find/, function(next){
    this.populate({
        path: "guides",
    })
    next()
})



//query selector to filer out tours marked as secret 
tourSchema.pre(/^find/, function(next){
    
    this.find({secretTours:{$ne:true}})
    
    next()
     
    
})




const Tour = mongoose.model('Tour',tourSchema)

module.exports = Tour 