import axios from "axios";
import { Navigate } from "react-router-dom";
const BASE_URL="http://127.0.0.1:7575"
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

