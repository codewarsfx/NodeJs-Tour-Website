
const AppError = require("../utils/appError")

const handleDevelopmentErrors = (err,res) => {
     res.status(err.statusCode).json({
          err,
          status: err.status,
          message: err.message,
          stack: err.stack
     })
}


const handleProductionErrors = (err,res) => {
   
     if(err.operationalError){ 
             res.status(err.statusCode).json({
               status:err.status,
               message: err.message,
          })
     }   
     else{
          res.status(500).json({
               message:"Something went very wrong",
               status:"fail"
          }) 
     }
}

const handleCastErrors = (error) =>{
   const message = `sorry  ${error.path} : ${error.value} is invalid`
     return new AppError(message, 404)
}


const handleDuplicateErrors = (err)=>{
     const match = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]
     
     const message = `errror invalid entry ${match}. value exists already `
     
     return new AppError(message,500)
     
     
}

const handleValidationError = (error)=>{
     
     const message = Object.keys(error.errors).map(el=>(error.errors[el].message ))
     
     
     return new AppError(`The following Validation problems occured;  ${message.join(".  ")}`,500)
     
}





//Global handling error middleware
module.exports = (error,req,res,next) =>{
     error.statusCode = error.statusCode || 500
     error.status = error.status || "error"
     
     if(process.env.NODE_ENV === "development"){
          handleDevelopmentErrors(error,res)
     }
     else if(process.env.NODE_ENV === "production"){
          let newError ={...error}
          if(error.name === "CastError"){
                newError = handleCastErrors(error)
          }
          if(error.code === 11000){
               newError = handleDuplicateErrors(error)
          }
          
          if(error.name ==="ValidationError"){
               newError = handleValidationError(error)
          }
          
          
          
          handleProductionErrors(newError,res)
     }
     

     next()
}

