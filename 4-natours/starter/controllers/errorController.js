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



//Global handling error middleware
module.exports = (error,req,res,next) =>{
     error.statusCode = error.statusCode || 500
     error.status = error.status || "error"
     
     if(process.env.NODE_ENV === "development"){
          handleDevelopmentErrors(error,res)
     }
     else if(process.env.NODE === "production"){
          handleProductionErrors(error,res)
          
     } 
     next()
}

