const fs = require('fs')
const express = require('express')

const app = express()

app.use(express.json())

const data= fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`,"utf-8",(error)=>{
    if(error) console.log('an error occured while reading file ');
})

const toursData =JSON.parse(data)



app.get('/api/v1/tours',(req,res)=>{
    
    res.status(200).json({
        "status":"success",
        "results":toursData.length,
        "data":toursData
    })
})

app.post('/api/v1/tours',(req,res)=>{
    const newTourId= (toursData.length-1) + 1
    
    const newTour = Object.assign({id:newTourId},req.body)
    
    const newTours = [...toursData,newTour]

   fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(newTours),(error)=>{
       if(error) console.error('an error occured when trying to write file to system');
       
       res.status(201).json({
           "status":"success",
           "data": newTour
       })
   })    
})

app.get('/api/v1/tours/:id',(req, res)=>{
    
    const tour = toursData.find(item=>item.id === +(req.params.id))

    if(!tour) return res.status(404).json({
        "status": "fail",
        "message": "tour id not found"
    });
    
    res.status(200).json({
        "status": "success",
        "data": tour
    })
    
})

app.patch('/api/v1/tours/:id',(req,res)=>{
    
    if(+(req.params.id) > toursData.length) return res.status(404).json({
        "status": "fail",
        "message": "tour id not found"
    });
    
    res.status(200).json({
        "status": "success",
        "data": "successfully updated"
    })
    
    
})

app.delete('/api/v1/tours/:id',(req,res)=>{
    
    if(+(req.params.id) > toursData.length) return res.status(404).json({
        "status": "fail",
        "message": "tour id not found"
    });
    
    res.status(204).json({
        "status": "success",
        "data": "no content"
    })
    
    
})

const port =3000
app.listen(port,()=>{
    console.log('app is running on port 3000')
})