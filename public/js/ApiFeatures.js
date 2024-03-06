import axios from "axios";
const BASE_URL="https://my-trip-igi.onrender.com"
export async function getter(){
      console.log(await axios.get(BASE_URL));
}

export const signUpMethod=(pubkey,firstName,lastName,Email,password,confirmPassword)=>{
      console.log(pubkey,firstName,lastName,Email,password,confirmPassword);
      window.location.href="/dashboard";
}

export const loginMethod=async (pubkey,email)=>{
           await axios({
                  method:"POST",
                  url:BASE_URL+"/login",
                  
                  
            });
}
