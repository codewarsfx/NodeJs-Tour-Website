require('dotenv').config({ path: `${__dirname}/../.env`})


const mongoose = require('mongoose');
const app = require('./app')


const db = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)

mongoose.connect(db, {
    useNewUrlParser:true,
    useFindAndModify:false,
    useCreateIndex:true,
    useUnifiedTopology: true 
}).then(() => {
    console.log('database connected successfully')
})



//Schema blueprint 

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

const newTour = new Tour({
    name:"chidera",
    rating: 5.3,
    price:500
})

newTour.save().then(doc=>console.log(doc))


  


//SERVER
const port =process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`app is running on port ${port}`) 
})


