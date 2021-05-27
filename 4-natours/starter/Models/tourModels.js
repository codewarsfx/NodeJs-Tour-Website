const mongoose = require('mongoose')


// Schema and model for tour data
const tourSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true,"a Name is required "],
        unique: true  
    },
    rating: {
        type:Number,
        default:4.5
    },
    price: {
        type:Number,
        required:[true,"A price value must be presented"]
    }
})

const Tour = mongoose.model('Tour',tourSchema)

module.exports = Tour 