const Mongoose=require('mongoose');

const BookingSchema=new Mongoose.Schema({
    tour:{
        type:Mongoose.Schema.Types.ObjectId,
        ref:'Tour',
        required:[true,"Booking Must Belong to a Tour"]
    },
    user:{

        type:Mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true]
    },
    price:{
        type:Number,
        required:[true,"Booking must have a price"]
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    paid:{
        type:Boolean,
        default:true
    }
});
BookingSchema.pre("/^find/",function(next){
    this.populate("user").populate({path:"tour",select:"name"});
})

module.exports=Mongoose.model("bookings",BookingSchema);