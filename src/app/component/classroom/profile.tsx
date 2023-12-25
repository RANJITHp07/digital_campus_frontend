'use client'
import React,{useState,useEffect,ChangeEvent, useReducer, useRef} from 'react'
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
import FaceIcon from '@mui/icons-material/Face';
import EmailIcon from '@mui/icons-material/Email';
import AddCommentIcon from '@mui/icons-material/AddComment';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { reducer } from '@/reducer/profile/reducer';
import { initialState } from '@/reducer/profile/initalState';
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import setCanvasPreview from '@/services/setCanvasPreview';

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 200;

function Profile({addedClassroom,createdClassroom}:{addedClassroom:number,createdClassroom:number}) {
  const token=useAppSelector((state)=>state.authReducer.token)
  const [initalstate, dispatch] = useReducer(reducer, initialState);
  const [crop, setCrop] = useState<any>();
  const [imageCrop,setImageCrop]=useState(true)
  const imgRef=useRef<HTMLImageElement | null>( null)
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const {user,profile,modal,file,newpassword,state,oldpassword,update,open,hover}=initalstate

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
  e.target.files && dispatch({type:'SET_FILE',value:e.target.files[0] as File})
      dispatch({type:'SET_OPEN',value:true})
      setImageCrop(true)
       }
    }catch(err){
      message.info("Some error")
    }
  }

  const imagesListRef = ref(storage, "images/");

  //upload file
  const uploadFile = () => {
    if (file == null) return;
    
    setCanvasPreview(
      imgRef.current as HTMLImageElement,
      previewCanvasRef.current as HTMLCanvasElement,
      convertToPixelCrop(
        crop,
        imgRef.current?.width as number,
        imgRef.current?.height as number
      )
    )
    const dataUrl = previewCanvasRef.current?.toDataURL();
    console.log(previewCanvasRef)
    const imageRef = ref(storage, `images/${file.name + v4()}`);
    const imageData = dataUrl?.split(',')[1];
    const imageBytes = new Uint8Array(atob(imageData as string).split('').map((char) => char.charCodeAt(0)));
    
    uploadBytes(imageRef, imageBytes).then((snapshot:any) => {
      getDownloadURL(snapshot.ref).then(async(url) => {
        console.log(token)
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


  const onImageLoad = (e:any) => {
    const { width, height } = e.currentTarget;
    if(width<=200 || height <=200){
      message.error("Atleast 200 * 200 dimension")
      dispatch({type:'SET_OPEN',value:false})
      return;
    }
    if(imageCrop){
      const cropWidthInPercent = (MIN_DIMENSION / width) * 100;
      const crop = makeAspectCrop(
        {
          unit: "%",
          width: cropWidthInPercent,
        },
        ASPECT_RATIO,
        width,
        height
      );
      const centeredCrop = centerCrop(crop, width, height);
      setCrop(centeredCrop);
      setImageCrop(false)
    }
  };

  return (
    <div>
    <div className=" mx-5 lg:w-11/12 box_shadow mt-9 lg:mx-auto rounded-lg relative group ">
      <div className='relative h-1/2'>
      <div 
        className={` bg-cover bg-transparent bg-right h-100  w-full h-56  box_shadow rounded-t-md   relative`}
    style={{
      backgroundImage:  `url('/bgprofilepage.jpg')`,
    }}
    >
        <input type='file' name='file' id='file' className='hidden' onChange={handleFilechange}/>
        <div className='absolute top-28 left-4  w-10/12  cursor-pointer' onMouseMove={()=>dispatch({type:'SET_HOVER',value:true})} onMouseOut={()=>dispatch({type:'SET_HOVER',value:false})}>
          <div className='relative'>
          {
            profile ?  <Image src={profile} width={200} height={200} alt='profile' className='mx-auto md:mx-0  rounded-full border-2 z-0 '/>
            :
            ((user && user.profile)?
            <Image src={user.profile} width={200} height={200} alt='profile' className='mx-auto  md:mx-0 rounded-full border-2 z-0 '/>
            :
            <Image src={'/profile-logo.jpg'} width={200} height={200} alt='profile' className='mx-auto   md:mx-0 rounded-lg border-2 z-0 '/>)
             
          }
          {
            hover && 
            <div className=' absolute left-28  top-16 md:left-16'>
          <label htmlFor='file' className='cursor-pointer' >
            <AddAPhotoIcon  className='text-white text-6xl' />
            </label>
          </div>
          }
           
          </div>
        </div>      
        </div>
        </div>
        {
          user.firstName && user.lastName && user.username  && 
        <div className=' h-full mt-24 pb-2 md:flex'>
      <div className=" px-5 md:w-1/2">
        <p className="text-[#3b6a87]  my-1  "><FaceIcon  className='text-md'/> Username: {user.username[0].toUpperCase() + user.username.slice(1,user.username.length).toLowerCase()}</p>
        <p className="text-[#3b6a87]  my-1 "><EmailIcon  className='text-md'/> Email: {user.email}</p>
        <p className="text-[#3b6a87]  my-2  "><AddCommentIcon  className='text-md'/> Added classrooms: {addedClassroom}</p>
        <p className="text-[#3b6a87]  my-2  "><SaveAsIcon  className='text-md'/> Created classrooms: {createdClassroom}</p>
      </div>
      <div className="flex md:justify-end items-end m-2 mt-5 md:m-2 lg:mt-0 md:w-1/2">
      <a href={'/payment'} className='text text-white bg-[#3b6a87] p-2  mx-3 rounded-md'>Subscription</a>
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
      <Modal title={<span className="font-normal">Set the profile</span>} open={open} footer={null} onCancel={() => dispatch({type:'SET_OPEN',value:false})}>
  {file && (
    <div>
      <div className='flex justify-center items-center w-full my-2'>
      <ReactCrop
            crop={crop}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
            circularCrop
            keepSelection
            aspect={1}
            minWidth={MIN_DIMENSION}
            minHeight={MIN_DIMENSION}
          >
      <img ref={imgRef} src={URL.createObjectURL(file)}  alt='profile' className= 'border-2 z-0 max-h-[70vh]' onLoad={onImageLoad}/>
      </ReactCrop>
     

      {crop && (
        <canvas
          ref={previewCanvasRef}
          className="mt-4"
          style={{
            display: "none",
            border: "1px solid black",
            objectFit: "contain",
            width: 200,
            height: 200,
          }}
        />
      )}
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
