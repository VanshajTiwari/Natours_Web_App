const Express=require('express');
const Router=Express.Router();
const viewsControll=require('./../controllers/viewController');
const authController=require('../controllers/authController');
const userController=require('../controllers/userController');
// Router.get('/',(req,res)=>{
//     req.statusCode(200).render('base',{
//         tour:'The Forest Hiker',
//         user:'Jonas'
//     });
// });
Router.use(authController.protect);
Router.route('/login').get(viewsControll.getLoginForm);
Router.route('/').get(viewsControll.getOverview);
Router.route('/tour/:slug').get(viewsControll.getTour);
Router.get('/me',authController.islogged,viewsControll.getAccount); 
Router.get('/logout',authController.logout)
Router.get('/update-user-details',userController.updateMe);
module.exports=Router;