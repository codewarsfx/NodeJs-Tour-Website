require('dotenv').config({ path: `${__dirname}/../.env`});


const fs = require('fs');
const mongoose = require('mongoose');
const Tour  = require('./Models/tourModels')
const Review = require('./Models/reviewModel')
const User = require('./Models/userModel')

const db = process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD)
const reviewData = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/reviews.json`))
const tourData = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`))
const userData = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`))


const addToursToDatabase = async () => {
        try{
             await Review.create(reviewData, {
                 validateBeforeSave: false
             })
             await Tour.create(tourData, {
                 validateBeforeSave: false
             })
              await User.create(userData, {
                 validateBeforeSave: false
             })
             
             process.exit(1)
        }
        catch(error){
            console.log(error.message)
        }     
}

const deleteAllTours = async ()=>{
    try{
        
        await Review.deleteMany()
        await Tour.deleteMany()
        await User.deleteMany()
        process.exit(1)
        
    }
    catch(error){
        console.log(error.message)
    }
}


mongoose.connect(db, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true 
}).then(() => {
if(process.argv[2] === '--import'){
    addToursToDatabase()
  
}
else if(process.argv[2] === "--delete"){

    deleteAllTours()
}
})










