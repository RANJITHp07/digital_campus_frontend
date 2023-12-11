'use client'
import { updatePassword } from '@/apis/user';
import { useAppSelector } from '@/redux/store';
import { message } from 'antd';
import React,{ChangeEvent, useState} from 'react'
import {useRouter} from 'next/navigation'
import Cookies from 'js-cookie';

function ForgetPassword() {
    const [password,setpassword]=useState('');
    const [confirm_password,setconfirm_password]=useState('');
    const forgetToken=useAppSelector((state)=>state.authReducer.forgetPassword)
    const [loading,setloading]=useState(false)
    const router=useRouter()
    
    //to submit the forgetpassword
    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
      if( password.trim().length>0 && confirm_password.trim().length>0){
        if(password.length<8){
            message.info("minimum 8 characters");
            return
        }
         if(password===confirm_password){
            const id =forgetToken.id as number
             const res=await updatePassword(id,password)
             if(res.data.success){
                Cookies.remove("accessToken");
              router.push('/login')
             }
         }else{
            message.info("Password mismatching")
         }
      }else{
        message.info("Enter both the input fields")
      }
    }

  return (
    <div>
         <div className="grid place-content-center h-screen">
      <div className=" md:w-[30rem] p-3 mx-2 md:p-6 border-2 rounded-md box_shadow">
        <p className="text text-2xl text-[#194866]">Forgot Password</p>
        <p className="text text-[#194866]">Please ensure your password is secure and handle it with care</p>
        <form className='my-4' onSubmit={handleSubmit}>
            <input type='text' className= {`p-2 w-full border-2 ${ (password.length!=0 && password.length < 8) ? "mt-4" : "my-4"}  rounded-md text`} placeholder="Enter your new password" onChange={(e:ChangeEvent<HTMLInputElement>)=>setpassword(e.target.value)}/>
            {
              password.length!=0 && password.length<8 && <p className='text-xs mb-4 text-red-500 text'>minimum 8 charcters must be there</p>
            }
            
            <input type='password' className="p-2 w-full border-2 rounded-md text" placeholder="Conifrm your new password" onChange={(e:ChangeEvent<HTMLInputElement>)=>setconfirm_password(e.target.value)}/>
            <button className="w-full p-2 my-4 bg-[#194866] text-white rounded-md text">Submit</button>
        </form>
      </div>
    </div>
    </div>
  )
}

export default ForgetPassword