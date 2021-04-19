module.exports = (template, product)=>{
    
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

