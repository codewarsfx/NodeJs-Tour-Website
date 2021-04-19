const http = require('http');
const httpStatusCodes= require('http-status-codes');


const server = http.createServer((req, res) => {
    
    
    console.log(req.url)
    console.log(req.headers)
    console.log(req.method)
    
    
    
    
})

server.listen(8000,()=>{
    console.log('sevrer is running on port 8000')
})