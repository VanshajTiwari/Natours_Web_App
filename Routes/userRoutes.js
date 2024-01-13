const Express=require('express');
const userMethodCollection=require(__dirname+"/../controllers/userController");
const authController=require(__dirname+"/../controllers/authController");
const upload=require("./../utils/uploadImage");
//METHODS

//
//Routes.patch('/updateMyPassword',authController.updatePassword);
const Routes=Express.Router();
Routes.post('/signup',authController.signup);
Routes.post('/login',authController.login);
Routes.post('/forgetPassword',authController.forgetPasssword);
Routes.patch('/resetPassword/:token',authController.resetPassword);
// Routes.use(authController.protect);
//Routes.get('/logout',authController.logout);
Routes.patch("/updateMyPassword",authController.updatePassword);
Routes.patch("/updateMe",upload.single("profile_image"),userMethodCollection.updateMe);
Routes.get("/deleteMe",userMethodCollection.deleteMe);
Routes.get('/me',userMethodCollection.getMe,userMethodCollection.getUser);

Routes.use(authController.restrictTo('admin'));
Routes.route('/').get(userMethodCollection.getAllUsers)
                 .post(userMethodCollection.createUser);
Routes.route('/:id').get(userMethodCollection.getUser)
                    .patch(userMethodCollection.updateUser)
                    .delete(userMethodCollection.deleteUser);

module.exports=Routes; 