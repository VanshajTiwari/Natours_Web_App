Tour=require('../models/tourModel');
Users=require('./../models/userModel');
const catchAsync=require('../utils/catchAsync');
exports.getOverview=catchAsync (async (req,res)=>{
  //  res.status(200).send("Hello");
  // 1)Get tour data from collection
  // 2) Build template
  // 3) render that template using tour data from 1
  const tours=await Tour.find();
  res.status(200)//.send("hello");
   .render('overview',{
       title:"All tours",
       tours,
       user:res.locals.users
     }
     )
});
exports.getTour=catchAsync(async(req,res)=>{
    console.log(req.params);
    const tour= await Tour.findOne({slug: req.params.slug}).populate({path:'reviews',fields:"reviews rating user",populate:{path:"user"}}).populate({path:"guides"});
    if(!tour)
        return res.status(404).render('errorTemplate');
    //1) Get tha data, for the requested tour (including reviews and guides)
    //2) Build template
    
    //3) render template using data
    res.status(200).render('tour',{
        tour:tour,
        user:res.locals.users,
        title:tour.name
      }
    )
});
exports.getSignupForm=(req,res)=>{
  res.status(200).render('signup',{title:"Signup"});
}
exports.getLoginForm=(req,res)=>{

  if(res.locals.users){
    return this.getOverview(req,res);
  }
  res.status(200).render('login');
};

exports.getAccount=(req,res)=>{
  res.render('account',{title:"Your Account",user:res.locals.users});
}
