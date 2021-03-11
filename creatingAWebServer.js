const http= require('http')
const url= require('url');


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
