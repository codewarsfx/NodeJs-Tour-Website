const http= require('http')
const url= require('url');
const fs = require('fs');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8')
const dataObject= JSON.parse(data)


//lets create our own web server and

// in other create a server, do two things 
// first create the server and then start the server 

const server= http.createServer((req, res) => {
    const pathName = req.url
    if(pathName === '/overview' || pathName === '/'){
        res.end('this is the overview page ')
    }
    if(pathName === '/product'){
        res.end('this is the product page')
    }
    if(req.url === '/api'){
            res.writeHead(200,{
                "content-type":'application/json',
            })
            res.end(data)
        }
    else {
        res.writeHead(404,{
            contentType:'text/html',
        })
        res.end('<h1> error page not found </h1>')
    }
})

server.listen(8000,'127.0.0.1',()=>{
    console.log('server is running and listen to requests on port 8000')
});
