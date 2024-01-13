const multer=require('multer');
const path=require('path');
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        return cb(null,"public/img/users");
    },
    filename:function(req,file,cb){
        console.log(req.user);
       if(checkfileType(file))
            cb(null,req.user.id+".jpg");
    }
});
function checkfileType(file){
    const pattern=/jpg|jpeg|png|gif/;
    const flag=pattern.test((path.extname(file.originalname)).toLowerCase());
    if(!flag)
        throw new Error("Not an Image");
    return true;
}

const upload=multer({storage});

module.exports=upload;