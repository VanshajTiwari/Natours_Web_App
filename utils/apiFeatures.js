const Tour=require('./../models/tourModel');
class APIFeatures{
   
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;

    }
    filter(){
          //1>Filtering
          const queryObj={...this.queryStr};
          const excludedFields=['page','limits','sort','fields'];
          excludedFields.forEach(element => {
              delete queryObj[element];
          });
          //2>ADvance filtering
        //  console.log(queryObj);
          let dat=JSON.stringify(queryObj);
          dat=JSON.parse(dat.replace(/\b(gte|gt|lte|lt)\b/g,match=> `$${match}`));
          // console.log('above');
          // console.log(queryStr);
       //   console.log(JSON.parse(queryStr));
       //   console.log(queryObj,req.query);
     this.query=this.query.find(dat);
     return this;
    }
    sorting(){
       // console.log(this.query.then(ele=>console.log(ele)));
        this.query=this.query.select('-createdAt -__v');
        //     console.log(Boolean(await req.query.sort));
     
             if(this.queryStr.sort)
                 this.query=this.query.sort(); 
        return this;
    }
    limitFields(){
        if(this.queryStr.fields){
            let fields=this.queryStr.fields.split(',');
            let fieldsObj={_id:0};
            fields.forEach((ele)=>fieldsObj[ele]=1);
            this.query=Tour.find({},fieldsObj);
            //console.log(typeof fields); 
          //  console.log(query);
        }
        return this;}
    paginate()
    {
        const page=(this.queryStr.page*1)||1;
        const limit=(this.queryStr.limit*1)||100;
        const skipVal=(page-1)*limit;
        this.query=this.query.skip(skipVal).limit(limit);
        return this;
    }

}
module.exports=APIFeatures;