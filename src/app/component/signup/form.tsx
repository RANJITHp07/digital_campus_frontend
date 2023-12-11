'use client'
import React,{useRef,useState,ChangeEvent} from 'react'
import Cookies from 'js-cookie';
import Image from 'next/image'
import { CircularProgress } from '@mui/material';
import { AppDispatch,useAppSelector} from '@/redux/store';
import { useDispatch } from 'react-redux';
import { senduserEmail, userlogin } from '@/redux/features/user-auth-slice/action';
import { useRouter } from 'next/navigation';
import { Modal, message } from 'antd';
import { signInnWithGooogle } from '@/services/config/firebase';
import { SendEmail, emailVerification, getUser, updatePassword, updateUser, userSignup } from '@/apis/user';
import { openModal, setEmail } from '@/redux/features/user-auth-slice/reducer';


function Form({page}:{page:boolean}) {

  const dispatch=useDispatch<AppDispatch>()
  const navigation=useRouter()

  const loading:boolean=useAppSelector((state)=>state.userReducer.loading)
  const error:null | any=useAppSelector((state)=>state.userReducer.error)

   //user details
   const [open,setopen]=useState(false)
   const username=useRef<HTMLInputElement>(null);
   const firstName=useRef<HTMLInputElement>(null);
   const lastName=useRef<HTMLInputElement>(null);
   const email=useRef<HTMLInputElement>(null);
   const password=useRef<HTMLInputElement>(null);
   const confirm_password=useRef<HTMLInputElement>(null);


   const [text,settext]=useState(false)


   //to handle signin submission
   const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
    try{
      e.preventDefault()
          if(username.current && firstName.current && lastName.current && email.current && password.current && confirm_password.current){
             const user={
              firstName:firstName.current.value,
              lastName:lastName.current.value,
              email:email.current.value,
              username:username.current.value,
              password:password.current.value,
              confirm_password:confirm_password.current.value
             } 
            dispatch(senduserEmail(user))
          }
    }catch(err:any){

      message.info(err.response.data.message)
    }
   }

  

   //to handle the forgetpassword
   const handleForgetPassword=async()=>{
    if(email.current){
       if(email.current.value !==''){
          setopen(true)
          const user=await getUser(email.current.value)
          if(user.data.success){
             dispatch(setEmail(email.current.value))
          Cookies.set('forgetPassword', JSON.stringify({email:email.current.value,id:user.data.data.id}));
          await SendEmail(email.current.value,'user')
          message.success("Email sent")
          dispatch(openModal())
          }
       }else{

        message.info("Enter your email")
      }
    }
   }

   //handle login submission
   const handleLogin=async(e:React.FormEvent<HTMLFormElement>)=>{
    try{
      e.preventDefault()
      if(email.current && password.current){
        const user={
          email:email.current.value,
          password:password.current.value
        }
        const res=await dispatch(userlogin(user))
        res.payload && res.payload.success && Cookies.set('accessToken', JSON.stringify(res.payload.data));
        res.payload && res.payload.success && navigation.push('/classroom')
      }

    }catch(err:any){
      message.info(err.response.data.message)
    }
   }


   //to handle  signup using google authentication
   const handleGooglesignup=async()=>{
    try{
     const user=await signInnWithGooogle()
     const res= await userSignup(user)
     if(res.data.success){
      message.success("Signup successfully")
      navigation.push("/login")
  }else{
    message.info(res.data.message)
  }
      
    }catch(err:any){
      message.info(err.response.data.message)
    }
   }

   //to handle the google login authentication
   const handleGoogleLogin=async()=>{
    try{
      const user=await signInnWithGooogle()
      const res=await dispatch(userlogin({email:user?.email,password:user.password}))
      res.payload && res.payload.success && Cookies.set('accessToken', JSON.stringify(res.payload.data));
        res.payload && res.payload.success && navigation.push('/classroom')
    }catch(err:any){
      message.info(err.response.data.message)
    }
   }

  return (
    <div className="mx-6 my-9 md:my-7 xm:my-4  lg:my-7">
        <form onSubmit={page ? handleSubmit : handleLogin}>
          {
            page &&  <div className='md:flex justify-center'>
            <div className='md:w-1/2 md:mr-3'>
            <label className='text-xs font-medium text-gray-400'>
        Firstname<span className='text-red-500'>*</span>
            </label>
            <input
              id="firstname"
              type="text"
              placeholder="Enter your firstname"
              className=" block p-3 w-full md:p-2 lg:p-3 border-2 border-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ref={firstName}
              required
            />
            </div>
            <div className='md:w-1/2'>
            <label className='text-xs font-medium text-gray-400'>
        Lastname<span className='text-red-500'>*</span>
            </label>
            <input
              id="lastname"
              type="text"
              placeholder="Enter your lastname"
              className=" block w-full p-3 md:p-2 lg:p-3 border-2 border-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ref={lastName}
              required
            />
            </div>
          </div>
          }
          
          <div className=" md:my-4 xm:my-3 lg:my-4">
          <label className='text-xs font-medium text-gray-400'>
         email<span className='text-red-500'>*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className=" block w-full p-3 md:p-2 lg:p-3 border-2 border-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ref={email}
              required
            />
          </div>
          {
            page &&  <div className="md:my-4 xm:my-3 lg:my-4">
            <label className='text-xs font-medium text-gray-400'>
           username<span className='text-red-500'>*</span>
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                className=" block w-full p-3 md:p-2 lg:p-3 border-2 border-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ref={username}
                required
              />
            </div>
          }
          
          <div className='md:flex justify-center'>
            <div className={` ${!page? 'w-full': 'md:w-1/2 md:mr-3'}`}>
            <label className='text-xs font-medium text-gray-400'>
        password<span className='text-red-500'>*</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className=" block p-3 w-full md:p-2 lg:p-3 border-2 border-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ref={password}
              onChange={(e:ChangeEvent<HTMLInputElement>)=>{
                e.target.value.length>=8 ? settext(false) :settext(true)
              }}
              
              required
            />
            { text && page  &&
              <p className='text-xs text-red-500'>minimum 8 charcters must be there</p>
            }
            </div>
            {
              page &&  <div className='md:w-1/2'>
              <label className='text-xs font-medium text-gray-400'>
           confirmpassword<span className='text-red-500'>*</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="Confirm your password"
                className=" block w-full p-3 md:p-2 lg:p-3 border-2 border-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ref={confirm_password}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                required
              />
              </div>
            }
            
          </div>
          <button className={`bg-[#194866] ${page ? "my-5" : "mt-5"} w-full text-white p-3 rounded-md`}>{page ? (loading ? <CircularProgress className='text-white'/> : "Signup") :(loading ? <CircularProgress className='text-white'/> : "Login")}</button>
        </form>
        {!page && <p className='text cursor-pointer mb-5 mt-1 text-xs mx-2 text-[#194866] underline text-end' onClick={()=>handleForgetPassword()}>Forget Password?</p> }
        <p className='text-center text-xs font-serif text-slate-500'> {page ? "Also signup using": "Also login using"}</p>
        <div className='flex justify-center'>
          <Image src={'/google.png'} width={30} height={40} alt='google' className='rounded-full mt-3  cursor-pointer' onClick={ page ? handleGooglesignup : handleGoogleLogin }/>
        </div>
    </div>
  )
}

export default Form