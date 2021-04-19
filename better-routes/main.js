const http = require('http')
const fs = require('fs')


const router = require('./routes.js')



const customReadFile = (file, res)=>{
    
    fs.readFile(`${file}`,(error, data)=>{
        if(error){
            console.error("an error occured ",error )
        }  
        res.end(data) 
    })
     
}


router.createGetRequest('/overview',(req,res)=>{
    customReadFile('./views/overview.html',res)
})

router.createGetRequest('/product',(req,res)=>{
    customReadFile('./views/productTemplate.html',res)
})


const server = http.createServer(router.myRoutes
)


server.listen(8000,'127.0.0.1',()=>{
    console.log('server is running on port 8000')
})