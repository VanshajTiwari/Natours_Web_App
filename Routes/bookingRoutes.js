const Express=require('express');
const  authController   =require("./../controllers/authController");
const  bookingController=require("./../controllers/bookingController");
//METHODS

//
//Routes.patch('/updateMyPassword',authController.updatePassword);
const Routes=Express.Router();


Routes.get("/checkout-session/:tourId",authController.protect,bookingController.getCheckoutSession)
//
module.exports=Routes; 