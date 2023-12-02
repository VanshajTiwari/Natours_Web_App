module.exports=function(error,req,res,next){
   // console.log(error.stack);
    error.statusCode=error.statusCode||500;
    error.status=error.status || 'error';
  //  console.log("hello");
   return res.status(error.statusCode).json({
        status:error.status,
        message:error.message
    })
}