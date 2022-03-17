require('dotenv').config({ path: `${__dirname}/../config.env`});

const mongoose = require('mongoose');
const app = require('./app');


const db = process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD)


//catching synchronous errors around th
process.on('uncaughtException',error=>{
    console.error(error.message,error.name)
    process.exit(1)
})


//connect to mongoose db atlas server
mongoose.connect(db, {
    useNewUrlParser:true,
    useFindAndModify:false,
    useCreateIndex:true,
    useUnifiedTopology: true 
}).then(() => {
    console.log('database connected successfully')
})



//SERVER
const port =process.env.PORT || 3000
const server=app.listen(port,()=>{
    console.log(`app is running on port ${port}`) 
})

// catching async errors    
process.on("unhandledRejection",error=>{
    console.error(error.message,error.name)
    server.close(()=>{
        console.log("shutting down the server cause an error occured...")
        process.exit(1)
    })
})

