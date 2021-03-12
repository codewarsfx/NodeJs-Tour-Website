const http= require('http')
const url= require('url');
const fs = require('fs');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8')
const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`,'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/cardTemplate.html`,'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/productTemplate.html`,'utf-8')

const dataObject= JSON.parse(data)




const replaceTemplate = (template, product)=>{
    
    let output= template.replace(/{%productName%}/g,product.productName);
     
    output= output.replace(/{%price%}/g,product.price);
    output= output.replace(/{%image%}/g,product.image);
    
    output=output.replace(/{%quantity%}/g,product.quantity);
    
    output=output.replace(/{%description%}/g,product.description);
    output=output.replace(/{%id%}/g,product.id);
    output=output.replace(/{%productFrom%}/g,product.from);
    output=output.replace(/{%productNutrient%}/g,product.nutrients);
    
    if(!product.organic){
        output=output.replace(/{%organic%}/g,'not-organic')
    }
    return output
    
}







//lets create our own web server and

// in other create a server, do two things 
// first create the server and then start the server 

const server= http.createServer((req, res) => {
    const pathName = req.url
    //overview page 
    if(pathName === '/overview' || pathName === '/'){
        
        res.writeHead(200, {
            "content-type": "text/html"
        })
        
        
        const cardsHtml = dataObject.map(item=>(
            replaceTemplate(tempCard,item))
        ).join('')
        
        
       const finalServe= tempOverview.replace(/{%product-card%}/g,cardsHtml)
          
        res.end(finalServe)
        
    }
    
    //product page
    if(pathName === '/product'){

        res.end('this is the product page')
    }
    
    //api
    if(req.url === '/api'){
            res.writeHead(200,{
                "content-type":'application/json',
            })
            res.end(data)
        }
        
        
    //not found
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
