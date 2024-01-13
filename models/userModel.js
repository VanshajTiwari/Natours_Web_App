const mongoose=require('mongoose');
const validator=require('validator');
const bscrypt=require('bcryptjs');
const crypto =require('crypto');//encrypt no need to instal
const userSchema= mongoose.Schema({
    name:{type:String,required:[true,'User Must have Name']},
    email:{type:String,required:[true,"Email of User is not Given"],lowercase:true,validate:[validator.isEmail,'please provide a valid email']},
    photo:{type:String},
    role:{
        type:String,
        enum:['user','guide','lead-guide','admin'],
        default:'user'
    },
    password:{type:String,required:[true,"Password of user is not provided"],minlength:8,select:false},
    passwordConfirm:{type:String,required:[false,"CONFIRM PASSWORD IS EMPTY"],
    validate:{
        validator:function(el){
             //This only work on save and create
            return el===this.password;  
        },  
        message:"Password are not same"
    }
},
passwordChangedAt:Date,
passswordResetToken:String,
passwordResetExpires:Date,
active:{
    type:Boolean,
    default:true,
    select:false
}
});
/// Encryption
    userSchema.pre('find',async function(next){
            this.find({active:true});
            next();
    })
    userSchema.pre('save',async function(next){
     //   Only run function if password is modified
        if(!this.isModified('password')){
            return next();
        }
        //bcrypt    //hash password with cost of 12
         this.password=await bscrypt.hash(this.password,12);
         this.passwordConfirm=undefined;//delete fields;

         next();
    });
userSchema.methods.correctPassword=async function(candidatePassword,userPassword){
  return await bscrypt.compare(candidatePassword,userPassword);
};
userSchema.methods.changesPasswordAfter=async function(JWTTimesstamp){
    if(this.passwordChangedAt){
      console.log(this.passwordChangedAt,JWTTimesstamp);  
    }
    
    return false;
}
///
userSchema.methods.createPasswordResetToken=function(){
    const resetToken =crypto.randomBytes(32).toString('hex');
    this.passswordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires=Date.now()+10*60*1000;
    return resetToken;

}
const User=mongoose.model("User",userSchema);

module.exports=User;