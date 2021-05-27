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






  


//SERVER
const port =process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`app is running on port ${port}`) 
})


