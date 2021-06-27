class ApiFeatures {
    
    constructor(query,queryString){
        this.query= query;
        this.queryString = queryString;
    }
    
    
    // api filtering abilities
    
    filter(){
        const queryStringCopy = {...this.queryString}
        
        const ignoreFIlterStrings = ['page','limit','fields','sort']
        
        ignoreFIlterStrings.forEach(el=> delete queryStringCopy[el])
        
        const queryStringCopyAdv = JSON.stringify(queryStringCopy).replace(/\b(lt|lte|gt|gte)\b/,match=>`$${match}`)
        
        this.query = this.query.find(JSON.parse(queryStringCopyAdv))
        
        return this 
        
    }
    
    
    sort(){  
        if(this.queryString.sort){
            
            const sortString = this.queryString.sort.split(',').join(' ')
            
            this.query = this.query.sort(sortString)
        }
        else{
            this.query = this.query.sort('-createdAt')
        }   
        
    return this
    }
    
    
    fieldLimiting(){
    
        if(this.queryString.fields){
            const fieldString = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fieldString)
        }
        else {
            this.query = this.query.select('-__v')
        }
        
        return this
        
        
    }
    
    pagination(){
        const page = this.queryString.page * 1 || 1
        
        const limit = this.queryString.limit * 1 || 10
    
        const skip = (page - 1) * limit 
        
        if (this.queryString.page){
            this.query = this.query.skip(skip).limit(limit)
        }
        
        return this.query
        
        
    }
    
    
    
}



module.exports = ApiFeatures