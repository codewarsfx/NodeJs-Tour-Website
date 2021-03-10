
const fs = require('fs')


// // blocking or synchronous way for reading and writing files 
const text= fs.readFileSync('./txt/input.txt','utf-8');

const textOut = `This is what we know about the avocado: ${text}.\n Created on ${Date.now()}`

fs.writeFileSync('./txt/chidera.txt',textOut);

console.log('file has been written ')

// asynchronous method for reading and writing files 
fs.readFile('./txt/start.txt','utf-8',(err, text)=>{
    if(err) throw err;
    fs.readFile(`./txt/${text}.txt`,'utf-8',(error,data1)=>{
        if(error) throw error;
           fs.readFile(`./txt/append.txt`,'utf-8',(error,data2)=>{
        if(error) throw error;
        console.log(data1);
        fs.writeFile(`./txt/newFile.txt`,`${data1} \n ${data2}`,'utf-8',(err)=>{
            console.log('your file has been writing')
        })
    })
    })
})



console.log('reading file')