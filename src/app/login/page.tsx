'use client'
import React from 'react';
import Image from 'next/image';
import Form from '../component/signup/form';
import Link from 'next/link'
import dynamic from 'next/dynamic';
import {  AppDispatch, useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { setResend } from '@/redux/features/user-auth-slice/reducer';

// Use next/dynamic to lazily load the Otp component
const Otp = dynamic(() => import('../component/signup/otp'), { ssr: false });


function Login() {
  const modal:boolean=useAppSelector((state)=>state.userReducer.modal)
  const dispatch=useDispatch<AppDispatch>()
  
  return (
    <div>
      <div className='lg:absolute right-0 m-3 flex justify-end'>
           <Link href="/signup" className=' border-2 rounded-md py-1 px-3 text-[#194866] border-[#194866] ' onClick={()=>dispatch(setResend(false))} >Signup</Link>
      </div>
    <div  className="grid place-content-center xm:h-screen">
  <div  className={`  xm:flex  rounded-lg bg-white ${modal && 'blur'}`}>
    <div className='flex items-center justify-center'>
    <Image src={"/signin.jpg"} width={600} height={600} alt='signup' className='rounded-l-lg '/>
    </div>
     <div className='flex lg:items-center justify-center  xm:h-full my-3'>
      <div>
      <div className='mx-4'>
        <p className='text-3xl heading text-[#194866] text-center xm:text-left'>Welcome to Digital campus</p>
        <p className='text-sm  text-[#194866] '>Transforming Education, Empowering Minds – Welcome to the Digital Campus</p>
      </div>
      <Form page={false}/>
     </div>
     </div>
  </div>
  {
    modal &&  <Otp page={false}/>
  }
</div>
</div>
  );
}

export default Login;
