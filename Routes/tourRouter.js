const Express=require('express');
const authController=require('./../controllers/authController');
const { createReview } = require('../controllers/reviewController');
//METHODS 
const reviewRoute=require('./../Routes/reviewRoutes');
const {getAllTours,createTour,getToursWithin,getDistances,getTour,updateTour,deleteTour,getTourStats,getMonthlyPlan}=require(__dirname+'/../controllers/tourController');
const Router=Express.Router();
// Router.param('/:id/:y?',checkID);
Router.param('id',(req,res,next,val)=>{
  //  console.log(`the of value id : ${val}`);
    next();
})
//Router.route('/').get(getAllTours).post(checkBody,createTour);
//Router.route("/:tourId/reviews").post(authController.protect,authController.restrictTo('user'),createReview)
Router.use("/:tourId/reviews",reviewRoute)
Router.route('/monthly-plan/:year').get(authController.protect,authController.restrictTo('admin','lead-guide','guide'),getMonthlyPlan);
Router.route('/tour-stats').get(getTourStats);
Router.route('/').get(getAllTours).post(authController.protect,authController.restrictTo('admin','lead-guide'),createTour);
Router.get("/tours-within/:distance/center/:latlng/unit/:unit?/",getToursWithin)
//tours-distance?distance=233&center=-40,45&unit=mi
Router.route("/distance/:latlng/unit/:unit").get(getDistances);
Router.route('/:id/:y?').get(getTour).patch(updateTour).delete(authController.protect,
  authController.restrictTo('admin','lead-guide'),
  deleteTour);

module.exports=Router