const mongoose=require('mongoose');
const validator=require('validator');
// const User = require('./userModel');
const slugify=require('slugify');
const tourSchema=new mongoose
.Schema({
    name:{type:String,require:[true,'A tour have a Name'],unique:true,trim:true,maxlength:[40,"Limit Exceed 40 character"],minlength:[10,'length less than 10'],//validate:[validator.isAlpha,'Tour Name should only contain Cha']
},
    duration:{type:Number,reqired:[true,'A tour must have duration']},
    maxGroupSize:{type:Number,required:[true,'Tour must have A group Size']},
    difficulty:{type:String,required:[true,'Tour must have difficulty'],enum:{values:['easy','medium','difficult'],message:'INVALID Difficulty'}},
    ratingsAverage:{type:Number,default:4.5},
    ratingsQuantity:{type:Number,default:4.5},
    price:{type:Number,require:[true,'A tour must have a Price']},
    priceDiscount:{type:Number,validate:{validator:function(val){
        //this only points to current doc on NEW document creation
        return  val<this.price;//100<200
    }},message:"discount ({VALUE}) greater than price"},//CUSTOM Validator
    summary:{type:String,trim:true},
    description:{type:String,trim:true,required:[true,'A tour must have a description']},
    imageCover:{type:String,required:[true,'A tour must have a cover']},
    images:[String],
    createdAt:{type:Date,default:Date.now()},
    startDates:[Date],
    slug:{type:String},
    startLocation:{//GeoJSON
        type:{
            type:String,
            default:'Point',
            enum:["Point"]
             },
        coordinates:[Number],
        address:String,
        description:String
    },
    locations:[
        {
            type:{
                type:String,
                default:'Point',
                enum:["Point"]
            },
            coordinates:[Number],
            address:String,
            description:String,
            day:Number
        }
    ],
    guides:[
        {
            type: mongoose.Schema.ObjectId,
            ref:"User"
        }
    ],
//     reviews:[
//         {
//         type: mongoose.Schema.ObjectId,
//         ref:"Review"
//     }
// ]
},//virtual property
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});
tourSchema.index({startLocation:'2dsphere'});
tourSchema.virtual('durationWeeks').get(function(){
  //  console.log(this);
    return this.duration/7;
});
tourSchema.virtual('reviews',{
    ref:"Review",
    foreignField:'tour',
    localField:"_id",

});
tourSchema.pre('save',function(next){
    this.slug=slugify(this.name,{lower:true});
    next();
});
// tourSchema.post('/^find/',function(){
//     console.log("I run");
//     this.populate({  
//      path:"guides",
//      select:"-__v -passwordChangedAt"
//     })
    
// })
// tourSchema.pre('save',async function(next){
//     const guidesPromises=this.guides.map(async id=>await User.findById(id));
//     this.guides=await Promise.all(guidesPromises);
//     next();
// });
//MONGOOSE MIDDLEWARE :RUN BEFORE CREATE AND SAVE
// tourSchema.pre('save',async function(next){
//         const guidesPromises=this.guides.map(async id=> await User.findById(id));
//         this.guides=await Promise.all(guidesPromises);
//         next();
// });

//
const Tour=mongoose
.model('Tour',tourSchema);
module.exports=Tour;

//MOngoose has also middleware, we can a funct. 
//b/w the save cmd is issued ans the actual 
//saving of the document, or also after the 
//actual saving. And that's the reason 
//why mongoose middleware is also called
// pre and post middleware

//FOUR TYPE:-document,query,aggregate,Model.
