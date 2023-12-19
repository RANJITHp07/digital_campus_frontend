'use client'
import React,{useState,useEffect,ChangeEvent, useReducer} from 'react'
import Image from 'next/image'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { useAppSelector } from '@/redux/store';
import { getUser, resetPassword, updateDetails, updateProfile } from '@/apis/user';
import { Modal, message } from 'antd';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../../../services/config/firebase"
import { v4 } from "uuid";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import BadgeIcon from '@mui/icons-material/Badge';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FaceIcon from '@mui/icons-material/Face';
import EmailIcon from '@mui/icons-material/Email';
import AddCommentIcon from '@mui/icons-material/AddComment';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { reducer } from '@/reducer/profile/reducer';
import { initialState } from '@/reducer/profile/initalState';

function Profile({addedClassroom,createdClassroom}:{addedClassroom:number,createdClassroom:number}) {
  const token=useAppSelector((state)=>state.authReducer.token)
  const [initalstate, dispatch] = useReducer(reducer, initialState);
  const {user,profile,modal,file,newpassword,state,oldpassword,update,open}=initalstate

  useEffect(()=>{
    const fetchData=async()=>{
      if (token.email){
        const res=await getUser(token.email)
        dispatch({type:'SET_USER',value:res.data.data})
        dispatch({type:'SET_UPDATE',field:'education', value:res.data.data.education})
        dispatch({type:'SET_UPDATE',field:'about',value:res.data.data.education})
      }
    }
   fetchData()
  },[token])



  const handleFilechange=(e: ChangeEvent<HTMLInputElement>) => {
    try{

       if(e.target.files){
        const img = document.createElement("img");
  img.src = URL.createObjectURL(e.target.files[0])

  img.onload = () => {
    if(img.height>=300 && img.width>=300){
      e.target.files && dispatch({type:'SET_FILE',value:e.target.files[0] as File})
      dispatch({type:'SET_OPEN',value:true})
    }else{
       message.info("Atleast 300*300 dimension")
    }
  };
  img.onerror = (err:any) => {
    console.log("img error");
    console.error(err);
  };
       }
    }catch(err){
      message.info("Some error")
    }
  }

  const imagesListRef = ref(storage, "images/");

  //upload file
  const uploadFile = () => {
    if (file == null) return;
    const imageRef = ref(storage, `images/${file.name + v4()}`);
    uploadBytes(imageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async(url) => {
        if(token.id){
          const res=await updateProfile(token.id,url)
          console.log(res.data)
          message.info("Profile updated")
          dispatch({type:'SET_OPEN',value:false})
          dispatch({type:'SET_PROFILE',value:url})
        }
         
      });
    });
  };




  //reset password
  const handleReset=async()=>{
    try{
     if(oldpassword.trim().length===0 && newpassword.trim().length==0){
      message.info("Enter both the fields")
      return
     }
     if(oldpassword==newpassword){
      message.info("Cannot keep old password as the new password");
      return 
     }
      const res=await resetPassword(user.id as number,newpassword,oldpassword,user.password as string);
      if(res.data.success){
        message.success("Password changed")
        dispatch({type:'SET_MODAL',value:false})
      }
    }catch(err:any){
      message.info(err.response.data.message)
    }
        
  }

  //handleUpdate
  const handleUpdate=async()=>{
    try{
      if(update.education?.trim().length===0){
        dispatch({type:'SET_UPDATE',field:'education', value:null})
       
      }
      if(update.about?.trim().length===0){
        dispatch({type:'SET_UPDATE',field:'education', value:null})
        
      }
      await updateDetails(token.id as number,update);
      message.info("Successfully updated");
      dispatch({type:'SET_STATE',value:false})
      

    }catch(err){
      throw err
    }
  }

  return (
    <div>
    <div className=" mx-5 md:mx-3 lg:w-11/12 p-2 box_shadow mt-9 lg:mx-auto rounded-lg relative group md:flex">
      <div className='relative h-1/2'>
        
        <div className='absolute w-full h-full my-8 hover:opacity-100 opacity-0 transition-opacity cursor-pointer'>
          <div className='flex justify-center items-center my-16 z-50'>
          <label htmlFor='file' className='cursor-pointer' >
            <AddAPhotoIcon style={{ fontSize: 64, color: 'white' }} />
            </label>
          </div>
        </div>
        <input type='file' name='file' id='file' className='hidden' onChange={handleFilechange}/>
        <div className='hover:opacity-50 opacity-100'>
          {
            profile ?  <Image src={profile} width={200} height={200} alt='profile' style={{ width: 300, height: 300, overflow: 'hidden' }} className='mx-auto  border-2 z-0 '/>
            :
            ((user && user.profile)?
            <Image src={user.profile} width={400} height={400} alt='profile' className='mx-auto rounded-lg border-2 z-0 ' style={{ width: 300, height: 300, overflow: 'hidden' }}/>
            :
            <Image src={'/profile-logo.jpg'} width={200} height={200} alt='profile' className='mx-auto rounded-lg border-2 z-0 ' style={{ width: 300, height: 300, overflow: 'hidden' }}/>)
          }
        </div>      
        </div>
        {
          user.firstName && user.lastName && user.username  && 
        <div className=' md:w-3/4 h-full'>
      <div className=" px-5">
        <p className="text-[#3b6a87] my-1 text-xl "><BadgeIcon/> First Name: {user.firstName[0].toUpperCase() + user.firstName.slice(1,user.firstName.length).toLowerCase()}</p>
          <p className="text-[#3b6a87]  my-1 text-xl "><PeopleAltIcon/> Last Name: {user.lastName[0].toUpperCase()+ user.lastName.slice(1,user.lastName.length).toLowerCase()}</p>
        <p className="text-[#3b6a87]  my-1 text-xl "><FaceIcon/> Username: {user.username[0].toUpperCase() + user.username.slice(1,user.username.length).toLowerCase()}</p>
        <p className="text-[#3b6a87]  my-1 text-xl "><EmailIcon/> Email: {user.email}</p>
        <p className="text-[#3b6a87]  my-2 text-xl "><AddCommentIcon/> Added classrooms: {addedClassroom}</p>
        <p className="text-[#3b6a87]  my-2 text-xl "><SaveAsIcon/> Created classrooms: {createdClassroom}</p>
      </div>
      <div className="flex justify-end items-end m-2 mt-5 md:m-2 lg:mt-0 md:absolute bottom-2 right-2">
      <a href={'/payment'} className='text text-white bg-[#3b6a87] p-2 rounded-md'>Subscription</a>
        <button className='text text-white bg-[#3b6a87] p-2 rounded-md' onClick={()=> dispatch({type:'SET_MODAL',value:true})}>Reset Password</button>
      </div>
      </div>
     }
      <Modal title={<span className='text text-[#3b6a87] font-light'>Reset Password</span>}open={modal} footer={null} onCancel={() =>  dispatch({type:'SET_MODAL',value:false})}>
      <input type="password" className=" w-full p-2 rounded-md focus:outline-none border-slate-300 border-2 my-2 text" placeholder='Old Password' onChange={(e:ChangeEvent<HTMLInputElement>)=> dispatch({type:'SET_OLDPASSWORD',value:e.target.value})}/>
      <input type="password" className=" w-full p-2 rounded-md focus:outline-none border-slate-300 border-2 my-2 text" placeholder='New Password' onChange={(e:ChangeEvent<HTMLInputElement>)=> dispatch({type:'SET_NEWPASSWORD',value:e.target.value})}/>
      <div className="flex justify-end my-2">
              <button type='submit' className=" p-2 border-2 bg-[#3b6a87] text-white rounded-md px-4 text" onClick={handleReset}>Reset</button>
          </div>
      </Modal >
      <Modal open={open} footer={null} onCancel={() => dispatch({type:'SET_OPEN',value:false})}>
  {file && (
    <div>
      <div className='flex justify-center items-center w-full'>
      <Image src={URL.createObjectURL(file)} width={200} height={200} alt='profile' className='mx-auto rounded-lg border-2 z-0 ' style={{ width: 300, height: 300, overflow: 'hidden' }}/>
        </div>
      
    </div>
  )}
  <div className="flex justify-end">
    <button className='text text-white bg-[#3b6a87] p-2 rounded-md' onClick={uploadFile}>Upload</button>
  </div>
</Modal>
    </div>
    <div className='box_shadow my-5 lg:w-11/12 mx-5 md:mx-3 rounded-md lg:mx-auto p-2 pb-4  px-4 '>
      {
        !state && <div className="flex justify-end my-2">
        <ModeEditIcon className='text-[#3b6a87]' onClick={()=>dispatch({type:'SET_STATE',value:true})}/>
     </div>
      }
    <p className="text-sm  text-slate-500 mt-1 text">PERSONAL SUMMARY</p>
    {
      !state ? <p className=' min-h-[15rem] border-2 p-2 bg-slate-100 rounded-md overflow-auto text whitespace-pre-wrap text-slate-500 '>{!update.about ? "Not mentioned" : update.about }</p>
    :
    <textarea
    rows={9}
            cols={30}
            className="border-2 w-full text show-scrollbar hide-scrollbar text-slate-500 rounded-lg outline-focus:none whitespace-pre-wrap focus:outline-none p-2 bg-slate-100 md:w-full md:overflow-x-hidden"
            placeholder={!update.about ? "Not mentioned" : '' }
            defaultValue={update.about as string && update.about as string}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>dispatch({type:'SET_UPDATE',field:'about', value:e.target.value})}
          ></textarea>
        }
     <p className="text-sm  text-slate-500 mt-4 text">EDUCATIONAL QUALIFICATION</p>
     {
             !state ? <p className='min-h-[10rem] bg-slate-100 border-2 p-2 whitespace-pre-wrap  rounded-md  text text-slate-500 '>{!update.education ? "Not mentioned" : update.education }</p>
             :  
    <textarea
            rows={5}
            cols={30}
            className="m border-2 w-full text show-scrollbar hide-scrollbar text-slate-500 rounded-lg outline-focus:none whitespace-pre-wrap focus:outline-none p-2 bg-slate-100 md:w-full md:overflow-x-hidden"
            placeholder={!update.education ? "Not mentioned" : '' }
            defaultValue={update.education as string && update.education as string}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=> dispatch({type:'SET_UPDATE',field:'education', value:e.target.value})}
          ></textarea>
     }     
          {
            state && 
            <div className="flex justify-end my-2">
              <button type='submit' className=" p-2 border-2 bg-[#3b6a87] text-white rounded-md px-4 text" onClick={handleUpdate}>Update</button>
          </div>
          }
          
    </div>
    </div>
  )
}

export default Profile;
