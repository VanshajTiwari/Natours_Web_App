const Express=require('express');
const Router=Express.Router();
const viewsControll=require('./../controllers/viewController');
const authController=require('../controllers/authController');
const userController=require('../controllers/userController');
const multer=require('multer');
const storage=multer.diskStorage(
    {
    destination:(req,file,cb)=>{
        return cb(null,"./public/img/users")
    },
    filename:(req,file,cb)=>{
        // let type=file.mimetype.split("/")[1];
        return cb(null,`user-${req.user.name}.jpg`)
    }
}
);
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) 
     return cb(null, true);
    return cb(new Error('Only images are allowed!'), false);
    
  };
const upload=multer({storage,fileFilter:imageFilter});
// Router.get('/',(req,res)=>{
//     req.statusCode(200).render('base',{
//         tour:'The Forest Hiker',
//         user:'Jonas'
//     });
// });
Router.use(authController.protect);
Router.route('/signup').get(viewsControll.getSignupForm);
Router.route('/login').get(viewsControll.getLoginForm);
Router.route('/').get(viewsControll.getOverview);
Router.route('/tour/:slug').get(viewsControll.getTour);
Router.use(authController.islogged);
Router.get('/me',viewsControll.getAccount); 
Router.get('/logout',authController.logout)
Router.post('/update-user-details',upload.single("profile_image"),userController.updateMe);
Router.post("/user-password-update",authController.updatePassword);
module.exports=Router;