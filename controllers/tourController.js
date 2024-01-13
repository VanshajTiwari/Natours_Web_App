//const fs=require('fs');
const Tour=require(__dirname+'/../models/tourModel');
// const tours=JSON.parse(fs.readFileSync(__dirname+'/../dev-data/data/tours-simple.json','utf-8'));
const APIFeatures=require(__dirname+'/../utils/apiFeatures');
const AppError = require("../utils/appError");
const catchAsync=require("./../utils/catchAsync");
const factory=require("././handleFactory");
exports.getDistances=catchAsync(async(req,res,next)=>{
    const {latlng,unit}=req.params;
    const [lat,lng]=latlng.split(',');
    const multiplier=unit==="mi"?0.000621371:0.001
    if(!lat || !lng){
        next(AppError(new AppError("Please provide latitude & longitude",400)));
    }
    const distances=await Tour.aggregate([
        //requires atleast one GeoSpatial index
        {
            $geoNear:{
                near:{
                    type:'Point',
                    coordinates:[lng*1,lat*1]
                },
                distanceField:"distance",
                distanceMultiplier:multiplier
            }},{
            $project:{
                distance:1,
                name:1
                
            }
        }
    ]);
    res.status(200).json({
        status:'success',
       
        data:{data:distances}
    })
})
exports.getToursWithin=catchAsync(async(req,res,next)=>{
    const {distance,latlng,unit}=req.params;
    const [lat,lng]=latlng.split(',');
    const radius=unit==='mi'?distance/3963.2:distance/6378.1;
    if(!lat || !lng){
        next(AppError(new AppError("Please provide latitude & longitude",400)));
    }
    console.log(distance,lat,lng,unit,radius);
    const tours=await Tour.find({
        startLocation: { $geoWithin : {$centerSphere: [[lng,lat],radius ]} }});
    res.status(200).json({status:"Success",
    results:tours.length,
    data:{
        data:tours
    }});
});

exports.getAllTours= factory.getAll(Tour)
   
//       //  console.log(req.query);
//         //1>Filtering
//         const queryObj={...req.query};
//         const excludedFields=['page','limits','sort','fields'];
//         excludedFields.forEach(element => {
//             delete queryObj[element];
//         });
//         //2>ADvance filtering
//       //  console.log(queryObj);
//         let queryStr=JSON.stringify(queryObj);
//         queryStr=JSON.parse(queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=> `$${match}`));
//         // console.log('above');
//         // console.log(queryStr);
//      //   console.log(JSON.parse(queryStr));
//      //   console.log(queryObj,req.query);

//      //sorting
//         let query=Tour.find(queryStr).select('-createdAt -__v');
//    //     console.log(Boolean(await req.query.sort));

//         if(req.query.sort)
//             query=query.sort();    ///TO-DO
//       //  console.log(await query)
       
//         //Field limiting

//         if(req.query.fields){
//             let fields=req.query.fields.split(',');
//             let fieldsObj={_id:0};
//             fields.forEach((ele)=>fieldsObj[ele]=1);
//             query=Tour.find({},fieldsObj);
//             //console.log(typeof fields); 
//           //  console.log(query);
//         }

//         //  PAGINATION
//         const page=(req.query.page*1)||1;
//         const limit=(req.query.limit*1)||100;
//         const skipVal=(page-1)*limit;
//         const numTour=await Tour.countDocuments();
//         query=query.skip(skipVal).limit(limit);
//         if(skipVal>=numTour){
//             throw new Error("Page Not Found");
//         }           
  
exports.createTour= factory.createOne(Tour)
//     newId=tours.length;
//     newItem=Object.assign({id:newId},req.body);
//  //   console.log(newItem);
//     tours.push(newItem);
//     fs.writeFile(__dirname+"/dev-data/data/tours-simple.json",JSON.stringify(tours),err=>err);
 
    // const newTour=new Tour({});
    // newTour.save();

    //////////
    // try{
    //     const newTour= await Tour.create(req.body);
    //     newTour.save()
    //     res.status(201).json({
    //         status:'success', 
    //         data:{tour:newTour}
    //     });
    // }
    // catch(err){
    //     res.status(400).json({status:'Error',Err:err.message});
    // }
  

exports.updateTour= factory.updateOne(Tour);
   

exports.getTour=factory.getOne(Tour,{path:"reviews"});

// catchAsync(async (req,res)=>{
//         const tour=await Tour.findById({_id:req.params.id}).populate({  
//             path:"guides",
//             select:"-__v -passwordChangedAt"
//         }).populate('reviews');
//         //const tour=await Tour.find({_id:req.params.id}); //OLD
//         res
//         .status(200)
//         .json({
//             status:"success"
//             ,data:tour
// });
// }); 
exports.deleteTour=factory.deleteContent(Tour);
/*  exports.deleteTour=catchAsync(async (req,res)=>{
    
        await Tour.findByIdAndDelete({_id:req.params.id});
         //const tour=await Tour.find({_id:req.params.id}); 
         res
         .status(204)
         .json({
             status:"success"
             ,data:null
         });}
     );

*/     

exports.getTourStats=catchAsync(async (req,res)=>{
   
        const stats =await Tour.aggregate([
            {
                $match:{ ratingsAverage:{$gte:4.5}}
            },
            {
                $group: {
                    _id:'$difficulty',
                    numTours:{$sum:1},
                    numRating:{$sum:'$ratingsQuantity'},
                    avgRating:{$avg : '$ratingsAverage'},
                    avgPrice :{$avg : '$price'},
                    minPrice:{$min:'$price'},
                    maxprince:{$max:"$price"}
                }
            },{
                $sort:{avgPrice:1}
            }

        ]);
        res
        .status(200)
        .json({
            status:"success"
            ,data:stats
        });
    });
exports.getMonthlyPlan=catchAsync(async(req,res)=>{
  
        console.log(req.params);
        const year=req.params.year*1;
        console.log(year);
        const plan=await Tour.aggregate([
            {
                $unwind:'$startDates'
            },
            {$match:{startDates:{
                $gte:new Date(`${year}-1-1`),
                $lte:new Date(`${year}-12-31`)} 
                    }
            },
            {
                    $group:{
                        _id:{$month:"$startDates"},
                        numTourStarts:{$sum:1},
                        tours:{$push:"$name"}
                    }
            },
            {
                $addFields:{month:"$_id"}
            },
            {
                $project:{_id:0}
            },
            {
                $sort:{
                    numTourStarts:-1
                }
            }

        ]
    );
    res.status(200).json({Status:"success",plan:plan});
    });

// exports.checkID=(req,res,next)=>{
//     const para=req.params;
//    // console.log(para);
//     if(para.id>tours.length)
//         return res.status(404)
//         .json({
//             status:"failed"
//             ,data:"Inavalid ID"});
//     else 
//         next();
// }
// exports.checkBody=(req,res,next)=>{
//      //   console.log("check data ",Boolean(req.body));
//         if(req.body.name && req.body.price){
//             console.log('Im wroking fine from MiddleWare');
//             next(); 
//         }
//         else
//             res.send("name or price is missing");
// }