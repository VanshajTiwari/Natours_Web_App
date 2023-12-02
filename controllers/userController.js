const User=require(__dirname+'/../models/userModel');
const AppError = require("../utils/appError");
// const tours=JSON.parse(fs.readFileSync(__dirname+'/../dev-data/data/tours-simple.json','utf-8'));
const catchAsync=require("./../utils/catchAsync");
const factory=require("./handleFactory");
const filterObj=(obj,...allowedFields)=>{
    const newObj={}
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el))
            newObj[el]=obj[el];
    })
    return newObj;
}
exports.getAllUsers= factory.getAll(User);
exports.createUser=(req,res)=>{
    res.status(500).json({
        status:'error',
        message:"This route is not yet definded"
    });
};
exports.deleteMe=catchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{active:false});
    res.status(204).json({
        status:"success",
        data:null
    })
})
exports.updateMe=catchAsync(async(req,res,next)=>{
    //1) Create error if user POSTs password data
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError("This route is not for password updates. please use /updateMyPassword",400));
    }
    const filteredBody=filterObj(req.body,'name','email');
    //2) Update user document
    const updatedUser=await User.findByIdAndUpdate(res.locals.users.id,filteredBody,{
        new:true, 
        runValidator:true
    });
    res.status(200).json({
        status:"success",
        data:{updatedUser}
    })
}); 
exports.getMe=(req,res,next)=>{
    req.params.id=res.locals.users.id;
    next();
}
exports.getUser=factory.getOne(User);
// Do Not update passwords 
exports.updateUser=factory.updateOne(User);
exports.deleteUser=factory.deleteContent(User);

