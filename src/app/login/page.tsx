'use client'
import React from 'react';
import Image from 'next/image';
import Form from '../component/signup/form';
import Link from 'next/link'
import Otp from '../component/signup/otp';
import {  useAppSelector } from '@/redux/store';


function Login() {
  const modal:boolean=useAppSelector((state)=>state.userReducer.modal)
  
  return (
    <div>
      <div className='lg:absolute right-0 m-3 flex justify-end'>
           <Link href="/signup" className=' border-2 rounded-md py-1 px-3 text-[#194866] border-[#194866] '>Signup</Link>
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
    modal &&  <Otp page={true}/>
  }
</div>
</div>
  );
}

export default Login;
