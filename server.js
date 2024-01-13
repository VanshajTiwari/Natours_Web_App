const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const DB = process.env.DATABASE // process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD);

mongoose 
.connect(DB,{
    useNewUrlParser : true,
    family:4
})
.then(()=>{console.log('DB connection Established')});

 
// 
const App=require(__dirname+'/index');
const port ="8001";
App.listen(port,()=>console.log(`server Live :- http://127.0.0.1:${port}`));