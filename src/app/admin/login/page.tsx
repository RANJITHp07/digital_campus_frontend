'use client'
import { createAdmin } from '@/apis//user/admin'
import { message } from 'antd'
import React,{ChangeEvent, useState} from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

function Create() {
   
  const [email,setemail]=useState("")
  const navigation=useRouter()
  const [password,setpassword]=useState('')

   //handle submission
   const handleSubmission=async(e:React.FormEvent<HTMLFormElement>)=>{
    try{
        e.preventDefault()
      if(email.trim().length>0 && password.trim().length>0){
         const res=await createAdmin(email,password) 
         Cookies.set('accessToken', JSON.stringify(res.data.token));
        message.info(res.data.message)
        navigation.push('/admin/dashboard')
      }else{
        message.info("Enter both the input fields")
      }
    }catch(err:any){
        message.warning(err.response.data.message)
    }
   }


  return (
    <div className="grid place-content-center h-screen">
      <div className=" md:w-[30rem] p-3 mx-2 md:p-6 border-2 rounded-md box_shadow">
        <p className="text text-2xl text-[#194866]">Admin Dashboard</p>
        <p className="text text-[#194866]">Welcome to Digital campus admin dashboard</p>
        <form className='my-4' onSubmit={handleSubmission}>
            <input type='text' className="p-2 w-full border-2 my-4  rounded-md" placeholder="Enter your email"  onChange={(e:ChangeEvent<HTMLInputElement>)=>setemail(e.target.value)}/>
            <input type='password' className="p-2 w-full border-2 rounded-md" placeholder="Enter you admin credientials" onChange={(e:ChangeEvent<HTMLInputElement>)=>setpassword(e.target.value)} />
            <button className="w-full p-2 my-4 bg-[#194866] text-white rounded-md">Login</button>
        </form>
      </div>
    </div>
  )
}

export default Create