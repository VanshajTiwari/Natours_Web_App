const User=require("./../models/userModel");
const viewControll=require('./viewController');
const catchAsync=require("./../utils/catchAsync");
const jwt=require('jsonwebtoken');
const AppError=require('./../utils/appError');
const sendEmail=require('./../utils/email');
const crypto=require('crypto');
const signToken= id=>{
 return  jwt.sign({id:id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
}
const createSendToken=async(user,statusCode,res)=>{
    
    const token=signToken(user._id);
   
    return res.status(statusCode).json({
        status:"success",
        token,
        data:{
            user
        }
    })
} 
exports.signup= catchAsync(
    async (req,res)=>{
    
    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,
        role:req.body.role
    });
    //res.status(200).json({"run":"sfmdfmdf"})
   await createSendToken(newUser,201,res);
}
);
exports.logout=catchAsync(async (req,res,next)=>{
    res.cookie('jwt',"",{expires:new Date(Date.now()+10*1000)});

 //   res.status(200).json({status:"success"});
    res.redirect('/');
});
exports.login=catchAsync(async (req,res,next)=>{
    const {email,password}=req.body;
    console.log(email,password);
    // 1) check if email and password is exist
    if(!email||!password){
       return next(new AppError("plz provide email and password"),400);
    }
    // 2) Check if user exists && password is correct
     const user= await User.findOne({ email:email}).select("+password");
     console.log(user);
    // const correct=await user.correctPassword(password,user.password); //return boolean value 
     if(!user || !(await user.correctPassword(password,user.password))){
        return next(new AppError("Incorrect Email or password"),401);
     }
    // 3) If everything ok, send token to client
    const token=signToken(user._id);
    res.cookie('jwt',token,{
        expires: new Date(Date.now() +process.env.JWT_COOKIE_EXPIRES_IN*24*60*1000),
        secure:true, //only work in https
        httpOnly:true //Cokie cannot be modified by browser
    });
    res.status(200).redirect('/');
    // res.status(200).json({
    //     status:'success',
    //     token:token, 
    // });
});
exports.islogged=async(req,res,next)=>{
    if(!res.locals.users)
       return res.redirect("/");
    return next();
}
exports.protect=async(req,res,next)=>{
    console.log("protect");
    //1) Getting token and check of it's there
    // if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    //     token =req.headers.authorization.split(" ")[1];
    //   //  console.log(token);
    // }
    try{
        if(!req.cookies.jwt){
            return next();
            
         //   console.log(token);
        }
          //  return next(new AppError('You are not logged In',401));
        //2) Verification token 
        
        token =req.cookies.jwt;
        
        const decoded= await jwt.verify(token,process.env.JWT_SECRET); 
    
     
        //3)Check if User still exists
        const fresherUser=await User.findById(decoded.id);
        
      //  res.status(200).send(fresherUser);
        if(!fresherUser){
            return next(
                new AppError('The User beloging to this token does no longer exist',401)
            )
        }
        //4 check if user changed pass after the token was issued 
        // if(fresherUser.changesPasswordAfter(decoded.iat)){
        //     return next();
        // }
        req.user=fresherUser;
        res.locals.users=fresherUser;
    
        next();
      //  viewControll.getOverview(req,res,next);
    }
    catch(Err){
        console.log("Protect method :114 "+Err.message)
        next();
    }
   
};             
exports.restrictTo =(...roles)=>{
    return (req,res,next)=>{
        //roles is an array['admin','lead-guide','guide',user].role='user'
        if(!roles.includes(req.user.role))
            return next(new AppError("Use do not have permission to operate"),"403");
        console.log()
            next();
    }
}
exports.forgetPasssword=catchAsync(async (req,res,next)=>{
    // 1) Get User based on posted email.
    const user=await User.findOne({email:req.body.email});
    if(!user)
        return next(new AppError('There is no user with email address.',400));
    // 2) Generate the random reset token
    const resetToken=user.createPasswordResetToken();
    await user.save({validateBeforeSave:false});
    // 3) send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message=`ForGOT your Password? submit a PATCH REquest with your new password and passwordConfirm to ${resetURL}.
    IF you didn't with forget your password plz ignore thi smeail;`
    try{
        await sendEmail({
            email:user.email,
            subject:'Yout password reset token(Valid for 10 min)',
            message
        });
        res.status(200).json({
            status:'success',
            message:'Token sent to email'
        });
    }
   catch(err){
        user.passwordResetToken=undefined;
        user.passwordResetExpires=undefined;
        await user.save({validateBeforeSave:false});

        return next(
            new AppError("There was an error sending the email.try again later!"+err,500)
        )
   }
});
exports.resetPassword=catchAsync(async(req,res,next)=>{
    console.log('');
    //1) GET user based on the token
    const hasedToken=crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user=await User.findOne({
        passwordResetToken:hasedToken,
        passwordResetExpires:{$gt:Date.now()}
    });

    //2) IF token has not expired, and there is user,set the new password
    if(!user)
        return next(new AppError("Token is invalid or has expired",400))

    user.password=req.body.password
    user.passwordConfirm=req.body.passwordConfirm
    user.passwordResetExpires=undefined;
    user.passwordResetToken=undefined;
    await user.save();
    //3) update changePassswordAt property for the user
    //4) Log the user in, send JWT
    createSendToken(user,200,res)
});
exports.updatePassword=catchAsync(async(req,res,next)=>{

    //1)Get user from collection
    const user= await User.findById(req.user.id).select("+password")

    //2) Check if POSTED current password is correct
    if(!(await user.correctPassword(req.body.currentPassword,user.password))){
        return next(new AppError("Your current password is wrong",401));
    }
    //3) if so, update password
    if(req.body.NewPassword!==req.body.ConfirmPassword)
        return next(new AppError("Passwords mismatched",403));
    user.password=req.body.NewPassword;
    user.passwordConfirm=req.body.ConfirmPassword;
    await user.save();
    //user.findIdAndUpdate will not work as intended!
    //4) Log user in, send JWT
    createSendToken(user,200,res);
});