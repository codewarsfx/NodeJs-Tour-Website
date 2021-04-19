const httpStatusCodes = require('http-status-codes')



const routes ={
    "GET":{
        
        '/info' : (req,res) => {
            res.writeHead(200,{
                "content-type": "text/plain"
            })
            
            res.end('Welcome to the infomation page ')
            
        }
        
    },
    'POST' :{
        
    }
}

exports.myRoutes = (req,res)=>{
    const reqURl = req.url
    const reqMethod = req.method
    

    
    if(routes[reqMethod][reqURl]){
        
      routes[reqMethod][reqURl](req,res)       
    }
    
    else {
        res.writeHead(400,{
            "content-type":"text/html"
        })
        
        res.end('<h1>sorry page Not found </h1>')
    }
}


exports.createGetRequest = (url,action) =>{
    
    routes['GET'][url] =  action
}


