const http= require('http')


//lets create our own web server and

// in other create a server, do two things 
// first create the server and then start the server 

const server= http.createServer((req, res) => {
    res.end('hello from the server')
})

server.listen(8000,'127.0.0.1',()=>{
    console.log('server is running and listen to requests on port 8000')
});
