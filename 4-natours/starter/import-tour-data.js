require('dotenv').config({ path: `${__dirname}/../.env`});


const fs = require('fs');

const mongoose = require('mongoose');

const Tour  = require('./Models/tourModels')

const db = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);



const tourData = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

mongoose.connect(db, {
    useNewUrlParser:true,
    useFindAndModify:false,
    useCreateIndex:true,
    useUnifiedTopology: true 
}).then(() => {
    console.log('database connected successfully')
})


const addToursToDatabase = async () => {
        try{
             await Tour.insertMany(tourData)
             
             process.exit(1)
        }
        catch(error){
            console.log(error.message)
        }     
}

const deleteAllTours = async ()=>{
    try{
        
        await Tour.deleteMany()
        process.exit(1)
        
    }
    catch(error){
        console.log(error.message)
    }
}


if(process.argv[2] === '--import'){
    addToursToDatabase()
  
}
else if(process.argv[2] === "--delete"){
    deleteAllTours()
}



