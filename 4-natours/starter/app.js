const express = require('express')

const app = express()

app.get('/',(req, res) =>{res.status(200).send('hello chidera welcome to xpress')
})


const port =3000
app.listen(port,()=>{
    console.log('listening on port 3000')
})