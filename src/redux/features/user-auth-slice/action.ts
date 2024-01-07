import { SendEmail, getUser, userLogin } from "@/apis/user/user";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";

export const senduserEmail=createAsyncThunk(
   "user/sendEmail",
   async(user:{email:string,username:string,password:string,confirm_password:string,firstName:string,lastName:string},{rejectWithValue})=>{
        try{
            if(user.username.length<2 && user.firstName.length<2 ){
                message.info("Firstname and username must have atleast 3 character");
                return Promise.reject("input error");
            }else{
                if(user.password.length<8){
                    message.info("Password must be atleast 8 charcter");
                    return Promise.reject("input error");
                }
                if(user.password===user.confirm_password){
                    const response=await getUser(user.email);
                    if(!response.data.success){
                        const res=await SendEmail(user.email,user.username)
                        if(res.data.success){
                            message.success("Email sent")
                            return  {firstName:user.firstName,lastName:user.lastName,email:user.email,password:user.password,username:user.username}
                        }else{
                            return Promise.reject("wrong credientials");
                        }
                    }else{
                        
                        message.info("Already Exist");
                     return Promise.reject("input error");
                    }
                }else{
                    message.info("Password not matching");
                    return Promise.reject("input error");
                }
            }
            return Promise.reject("input error");
        }catch(err:any){
            rejectWithValue(err);
        }
   }
)

//to login 
export const userlogin=createAsyncThunk(
    "user/login",
    async(user:{email:string,password:string},{rejectWithValue})=>{
         try{
             const res=await userLogin(user)
             if(res.data.success){
                message.success("Successfully logged In")
                 return  res.data;
             }
             message.info(res.data.message)
             return Promise.reject("input error");
         }catch(err:any){
            message.info(err?.response.data.message)
             return rejectWithValue(err);
         }
    }
 )
