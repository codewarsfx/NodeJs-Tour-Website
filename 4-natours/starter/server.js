
 require('dotenv').config({ path: `${__dirname}/../.env`})

const mongoose = require('mongoose');


const db = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)

mongoose.connect(db,{
    useNewUrlParser:true,
    useFindAndModify:false,
    useCreateIndex:true
}).then(() => {
    console.log('database connected successfully')
})

const app = require('./app')

//SERVER
const port =process.env.PORT ||3000
app.listen(port,()=>{
    console.log(`app is running on port ${port}`) 
})

