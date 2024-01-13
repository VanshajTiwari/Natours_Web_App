const Review =require("./../models/reviewModel");
const catchAsync=require("./../utils/catchAsync");
const factory=require("./handleFactory");
exports.getAllReviews=factory.getAll(Review);

// exports.getAllReviews=catchAsync(async (req,res,next)=>{
//     const reviews=await Review.find({tour:req.params.tourId}).populate({path:'user',select:"name role email"}).populate({path:"tour",select:"name price"}); //video 155 what to show in populate

//     // if(!reviews.length)
//     //     reviews=reviews?await Review.find({req.params.id.length()===0?:req.params.id}):"";
//     res.status(200).json({
//         status:'success',
//         results:reviews.length,
//         data:{
//             reviews
//         } 
//     });
// });
exports.setTourUserId=(req,res,next)=>{
    if(!req.body.tour) req.body.tour=req.params.tourId
    if(!req.body.user) req.body.user=res.locals.users._id
    next();
}
exports.getReview=factory.getOne(Review,{path:"user"})
exports.createReview=factory.createOne(Review);
exports.updateReview=factory.updateOne(Review);
exports.deleteReview=factory.deleteContent(Review);