// const sendEmail= async options =>{
//     // 1) Create a Transporter
//     const transporter=nodemailer.createTransport({
//        // service:"Gmail",
//        host:process.env.EMAIL_HOST,
//        port:process.env.EMAIL_PORT,
//         auth:{
//             user:process.env.EMAIL_USERNAME,
//             pass:process.env.EMAIL_PASSWORD
//         }
//         //Activate in gmail "less secure app" option
//     }); 
//     // 2) Define the email options
//     const mailOption={
//         from:'Vanshaj tiwari vanshajtiwari6',
//         to:options.email,
//         subject:options.subject,
//         text:options.message,
//        // html:
//     }
//     // 3) Actually send the email  
//    await transporter.sendMail(mailOption);
// }
// module.exports=sendEmail;
const  htmlToText  = require('html-to-text');
const nodemailer=require('nodemailer');
const pug=require('pug');
const SG=require("@sendgrid/mail");
module.exports= class Email{
    constructor(user,url){
        this.to=user.email;
        this.firstName=user.name.split(" ")[0];
        this.url=url;
        this.from=`Vanshaj Tiwari`;
        
    }
    NewcreateTransport(){
        
        if(process.env.NODE_ENV==='production'){
            SG.setApiKey(process.env.SENDGRID_PASSWORD);
            return nodemailer.createTransport({
                service:"SendGrid",
                auth:{
                    user:process.env.SENDGRID_USERNAME,
                    pass:process.env.SENDGRID_PASSWORD
                }
            });
        }
        return nodemailer.createTransport({
            // service:"Gmail", 
            host:process.env.EMAIL_HOST,
            port:process.env.EMAIL_PORT,
             auth:{
                 user:process.env.EMAIL_USERNAME,
                 pass:process.env.EMAIL_PASSWORD
             }
             //Activate in gmail "less secure app" option
         }); 
    }
    async send(template,subject){
        //send the Email
        //1) Render HTML Based on a Pug template 
        const html=pug.renderFile(`${__dirname}/../views/email/${template}.pug`,{
            firstName:this.firstName,
            url:this.url,
            subject,

        }); 
        //2) Define Email Options
        const MailOptions={
            from :"vanshaj.tiwari_cs21@gla.ac.in",
            to:this.to,
            subject,
            html,
            text:htmlToText.htmlToText(html)
        }
        await this.NewcreateTransport().sendMail(MailOptions);
    }
    async sendWelcome(){
       await  this.send('welcome','Welcome to the Natours Family!');
    }
    async sendPasswordReset(){
        await this.send("passReset","Your Password Rest Token Valid for 10 Minutes")
    }
}


