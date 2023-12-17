'use client'
import React,{ChangeEvent, useState} from 'react'
import Image from "next/image"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { MenuProps } from 'antd';
import { Dropdown ,Modal,Tooltip, message} from 'antd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useRouter } from 'next/navigation';
import { DELETE_CLASS, FETCH_ADDED_CLASSROOM_QUERY, FETCH_ALL_CLASSROOM_QUERY, FETCH_CLASSROOM_QUERY, REMOVE_STUDENT, UPDATE_CLASSROOM_DETAILS } from '@/apis/classroom';
import { useAppSelector } from '@/redux/store';
import { useMutation } from '@apollo/client';

function Class({className,creator,id,code,type,bg,subject,section,profile}:{className:string,creator:string,id:string,code?:string,type:boolean,bg:string,subject?:string,section?:string,profile:string}) {

  const token=useAppSelector((state)=>state.authReducer.token)
  const navigation=useRouter()
  const [open,setopen]=useState(false)
  const [classroom,setclassroom]=useState({
    className:className,
    classSection:section,
    classSubject:subject,
    profile:profile
  })

  //items of the class menu
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <p onClick={!type ? removeStudent : deleteClass}>{!type ? "Unenroll" : "Delete"}</p>
      ),
    },
    {
      key: '3',
      label: (
        <p onClick={type ? handleEdit : deleteClass}>{ type ? "Edit" : "Report Abuse"}</p>
      ),
    }
    
  ]

  //setopen
 async function handleEdit(){
    setopen(true)
  }

  //to remove student query
  const [remove_student]=useMutation(REMOVE_STUDENT,{
    onError(err){
         console.log(err)
         console.log(code,token.id)
    },
    variables:{
      userId:token.id,
      code:code
    },
    refetchQueries: [{ query: FETCH_ADDED_CLASSROOM_QUERY ,variables:{id:token.id}},
      { query: FETCH_ALL_CLASSROOM_QUERY ,variables:{id:token.id}}],
    onCompleted: () => {
      message.info("Existed from the classroom")
    }
 })


  async function removeStudent(){
     try{
         await remove_student()
     }catch(err){
      throw err
     }
  }

   //to delete class
   const [delete_class]=useMutation(DELETE_CLASS,{
    onError(err){
         console.log(err)
    },
    variables:{
    id:id
    },
    refetchQueries: [{ query: FETCH_CLASSROOM_QUERY ,variables:{id:token.id}},
      { query: FETCH_ALL_CLASSROOM_QUERY ,variables:{id:token.id}}
    ],
    onCompleted: () => {
      message.info("Class is deleted successfully")
    }
 })

  async function deleteClass(){
    try{
    await  delete_class()
    }catch(err){
      throw err
    }
  }


   //to update the classroom
 const [updateClassroom]=useMutation(UPDATE_CLASSROOM_DETAILS,{
  variables:{
    id:id,
    update:classroom
  },
  onError(err){
      console.log(err)
  },
  onCompleted:()=>{
    setopen(false);
    message.info('Updated')
  }
 })

 const handleUpdate=async(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault()
  await updateClassroom()
 }


  return (
    <div
      className="w-72 box_shadow rounded-lg mx-auto md:mx-5 lg:mx-8 h-72 my-8 relative cursor-pointer"
    >
      <div
        className="w-full h-1/2 bg-cover bg-transparent bg-right  relative rounded-t-lg py-2 px-1"
        style={{
          backgroundImage: `url(${bg})`,
        }}
      >
        <div className='flex justify-end  cursor-pointer'>
        <Dropdown menu={{ items }} placement="bottomLeft">
          <MoreVertIcon className="text-white"/>
          </Dropdown>
          </div>
        <div className="absolute top-16 left-5 w-full" onClick={()=>navigation.push(`/classroom/${id}?code=${code}`)}>
          <Image src={classroom.profile!==''?'/profile-logo.jpg' : classroom.profile} width={120} height={120} alt='' className='rounded-full z-50 ' />
        </div>
      </div>
      <div className="flex justify-end mx-2" onClick={()=>navigation.push(`/classroom/${id}`)}>
        <div>
          <p>{classroom.className.length >0 && (classroom.className[0].toUpperCase() + classroom.className.slice(1,className.length).toLowerCase())}</p>
          <p className="text-xs">{creator}</p>
        </div>
      </div>
      <div className='absolute bottom-0 w-full  '>
        <hr/>
        <div className='flex justify-end m-3'>
        <Tooltip placement="topRight" title={"see all the participants"}>
          <AssignmentIndIcon className='text-[#8cb6d0] text-2xl mx-2 cursor-pointer'/>
          </Tooltip>
          <Tooltip placement="topLeft" title={"see all the assignments"}>
        <AssignmentIcon className='text-[#8cb6d0] text-2xl cursor-pointer'/>
        </Tooltip>
        </div>
      </div>
      <Modal title={`Create Class`} open={open} footer={null}onCancel={()=>setopen(false)} >
         <form className="mt-5" onSubmit={handleUpdate} >
          <input type="text" className=" w-full p-2 rounded-md focus:outline-none border-slate-300 border-2 my-2 text" placeholder='Class name(max 20 character)' defaultValue={classroom.className} onChange={(e:ChangeEvent<HTMLInputElement>)=>setclassroom({...classroom,className:e.target.value})}/>
          <input type="text" className=" w-full p-2 rounded-md focus:outline-none border-slate-300   border-2 my-2 text" placeholder='Class section' defaultValue={classroom.classSection} onChange={(e:ChangeEvent<HTMLInputElement>)=>setclassroom({...classroom,classSubject:e.target.value})}/>
          <input type="text" className=" w-full p-2 rounded-md focus:outline-none  border-slate-300  border-2 my-2 text" placeholder='Class subject' defaultValue={classroom.classSubject} onChange={(e:ChangeEvent<HTMLInputElement>)=>setclassroom({...classroom,classSection:e.target.value})}/>
          <div className="flex justify-end my-2">
              <button type='submit' className="bg-slate-300 p-2 border-2 text-slate-700 rounded-md px-4 text ">Update</button>
          </div>

         </form>
      </Modal>
    </div>
  );
}


export default Class