const strip=require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour=require("./../models/tourModel");
const catchAsync=require("./../utils/catchAsync");
const factory=require("./handleFactory");
const AppError=require("./../utils/appError");


exports.getCheckoutSession=catchAsync(async(req,res,next)=>{
    //1) Get the Cirrently Booked tour
    const tour =await Tour.findById(req.params.tourId);
    //2) Create Checkout session
    const session=await strip.checkout.sessions.create({
        payment_method_types:['card'],
        success_url:`${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url:`${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email:req.user.email,
        client_reference_id:req.params.tourId,
        line_items:[
            {
                // name:`${tour.name}`,
                // description:tour.summary,
                // images:["https://th.bing.com/th/id/OIP.iAhcp6m_91O-ClK79h8EQQHaFj?rs=1&pid=ImgDetMain"],
                // amount:tour.price*100, 
                // currency:"usd",
                price_data:{
                    currency:'inr',
                    unit_amount:tour.price*100,
                    product_data:{
                        name:tour.name,
                        description:tour.summary,
                        images:["https://th.bing.com/th/id/OIP.iAhcp6m_91O-ClK79h8EQQHaFj?rs=1&pid=ImgDetMain"],
                    },
                },
                quantity:1,
            }
        ],
        mode:'payment'
    });
    //3)Create session as response
    res.status(200).json({
        status:"success",
        session
    });
});

exports.createBookingCheckout=(req,res)=>{
    const {tourId,user,price}=req.query;
    if(!tourId && !user && !price){
        next();
    }
}

