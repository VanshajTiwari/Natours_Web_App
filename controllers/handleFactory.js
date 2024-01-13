const catchAsync = require("../utils/catchAsync");
const AppError=require("./../utils/appError");
const APIFeatures=require("../utils/apiFeatures");
exports.deleteContent=(modal)=>catchAsync(async(req,res,next)=>{
    const doc=await modal.findByIdAndDelete(req.params.id);
    if(!doc){
        return next(new AppError("No document found with that ID",400));
    }
    res.status(204).json({
        status:'success',
        data:null
    });
})

exports.updateOne=modal=>catchAsync(async (req,res,next) =>{
    
    const doc=await modal
            .findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        if(!doc)
            return next(new AppError("No document found with that ID",400));
        res.status(201).json(
            {
                status:"success",
                data:{data:doc}
            }
        );
});
exports.createOne=modal=>catchAsync(async(req,res,next)=> {
    
    const newSet= await modal.create(req.body);
        newSet.save()
        res.status(201).json({
            status:'success', 
            data:{data:newSet}
        });
        next();
    });

exports.getOne=(modal,popOption)=>catchAsync(async (req,res,next)=>{
    let query=await modal.findById(req.params.id)
    if(popOption)
        query=query.populate(popOption);
    const doc=await query;
    if(!doc){
        next(new AppError('No document found with with ID',404));
    }
    res.status(200).json({
        status:"Success",
        data:{
            data:doc
        }
    })
})
exports.getAll=(modal)=>catchAsync(async (req,res,next)=>{
    // To Allow for nested GET reviews on tour (hack)
    let filter={};
    if(req.params.tourId)
        filter={tour:req.params.tourId};
    const features=new APIFeatures(modal.find(filter),req.query)
    .filter()
    .sorting()
    .limitFields()
    .paginate();
    const doc=await features.query;

    res
    .json({
        status:"success"
        , result:doc.length,
        data: {data:doc} 
    });}
);
