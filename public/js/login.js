const login= async (email,password)=>{
    try{const res=await axios({
        method:"POST",
        url:'http://127.0.0.1:8000/api/v1/users/login',
        data:{
            email:email,
            password:password}
        });
        
        console.log(res);
    }
    catch(err){
        console.log(err.response);
    }
   
}
const loggingOut= async ()=>{
    try{const res=await axios({
        method:"GET",
        url:'http://127.0.0.1:8000/api/v1/users/logout'});
        
        window.location.reload(true);    
    }
    catch(err){
        console.error(err);
    }
   
}
document.querySelector('.login--form').addEventListener('submit',e=>{
  //  e.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
  
  //  login(email,password);
})
const logout=document.querySelector(".nav__el--logout")
console.log(logout);
logout.addEventListener("click",e=>{
  //  console.log("hey")
  //  e.preventDefault();
  //  loggingOut();
})