const fs=require('fs');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config({path:'./../../config.env'});
//console.log(__dirname);
const Tour=require('./../../models/tourModel');
const User=require('./../../models/userModel');
const Review=require('./../../models/reviewModel');
const Str=process.env.DATABASE_LOCAL;
const DB = Str//.replace('<password>',process.env.DATABASE_PASSWORD);
mongoose
.connect(DB,{
    useNewUrlParser : true,
    family:4
})
.then(()=>{console.log('DB connection Established')});


//READ JSON FILE
const tours=JSON.parse(fs.readFileSync('./tours.json','utf-8'));
const users=JSON.parse(fs.readFileSync('./users.json','utf-8'));
const reviews=JSON.parse(fs.readFileSync('./reviews.json','utf-8'));
//console.log(tours);

//import DATA into INTO DB

const importData= async()=>{
    try{
        let T=await Tour.create(tours);
      let U= await User.create(users);
       let r= await Review.create(reviews);
        console.log('Data is Successfully imported');
    }
    catch(err){
        console.log(err);
    }
    process.exit();
}

//DELETE All DATa Collection

const deleteData =async()=>{
    try{
        await Tour.deleteMany();
        console.log("Data Successfully Deleted!");
    }
    catch(err){
        console.log(err);
    }
    process.exit();
}

if(process.argv[2]==='--import'){
    importData();
}
else if(process.argv[2]==='--delete')
    deleteData();