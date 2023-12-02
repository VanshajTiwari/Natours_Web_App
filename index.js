const morgan=require('morgan');
const AppError=require('./utils/appError');
const globalErrorHandler=require('./controllers/errorController');
const dotenv=require('dotenv');
const port =process.env.PORT || "3000";
const slug=require('slugify');
const Express=require('express');
const rateLimit=require('express-rate-limit');
const App=Express();
const cookieParser=require('cookie-parser');
//const pug=require('pug');
const path=require('path');
const tourRouter=require('./Routes/tourRouter');
const userRouter=require('./Routes/userRoutes');
const reviewRouter=require("./Routes/reviewRoutes");
const viewRouter=require('./Routes/viewRoutes');
//limit Requests
const limiter=rateLimit({
    max:10000,
    windowMs:60*60*1000,
    message:'Too many requests from this IP,please try ahain in an hour!'
});
//App.use(slug);
App.use(limiter)

App.use(cookieParser());
//MIDDLEWARE
App.use((req,res,next)=>{
  
    next(); });

//console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV==='development')
    App.use(morgan('dev'));
App.use(Express.json());
App.use(Express.urlencoded({extended:true}));
App.use(Express.static(__dirname+"/public"));

//METHODS

//Routing
// App.patch("/api/v1/tours/:id",updateTour)
// App.get('/api/v1/tours/:id',getTour);
// App.get('/api/v1/tours',getAllTours);
// App.post('/api/v1/tours',createTour);

 App.set('view engine','pug');
 App.set('views',path.join(__dirname,'/views'));

App.use('/',viewRouter);
App.use('/api/v1/tours',tourRouter);
App.use('/api/v1/users',userRouter);
App.use('/api/v1/reviews',reviewRouter);
App.all("*",(req,res,next)=>{
    // const error=new Error(`Can't Find ${req.originalUrl} on this server`);
    // error.status="failed";
    // error.statusCode=404;
        next(new AppError(`Can't Find ${req.originalUrl} on this server`,404))
});

App.use(globalErrorHandler);
module.exports=App;