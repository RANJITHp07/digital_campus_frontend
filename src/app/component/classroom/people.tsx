'use client'
import React, { ChangeEvent, useState } from 'react'
import Image from 'next/image'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_TO_ADMIN, REMOVE_FROM_ADMIN, REMOVE_STUDENT, SEND_INVITATION } from '@/apis/classroom/mutation';
import { Modal, Popconfirm, Tooltip, message } from 'antd';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { useAppSelector } from '@/redux/store';
import { GET_PARTICIPANTS } from '@/apis/classroom/query';
import { ClassroomParticipants } from '@/@types/classroom';

function People({id,code}:{id:string,code:string}) {

  const[open,setopen]=useState(false)
  const [open1,setopen1]=useState(false)
  const token=useAppSelector((state)=>state.authReducer.token)
  const creator=useAppSelector((state)=>state.classroomReducer.creator)
  const [email,setemail]=useState('')
   //to get all the participants
    const { data }=useQuery(GET_PARTICIPANTS,{
        variables:{
            id:id
        },
        onError(err){
          message.error("Some error occurred")
        },
    })


    //to add student into admins
    const [addToAdmin]=useMutation(ADD_TO_ADMIN,
      {
        onError(err){
          message.error("Some error ocuured")
         },
         refetchQueries: [{ query: GET_PARTICIPANTS ,variables:{id:id}}],
         onCompleted:()=>{
          message.info("Added to admin")
         }
      } 
      
    )
   const  handleAddToAdmin=async(userId:string)=>{
       await addToAdmin({
        variables:{
          id:userId,
          classroomId:code
        }
       })
       setopen(false)
    }

    //to remove from admin
    const [removeFromAdmin]=useMutation(REMOVE_FROM_ADMIN,
      {
        onError(err){
          message.error("Some error ocuured")
         },
         refetchQueries: [{ query: GET_PARTICIPANTS ,variables:{id:id}}],
         onCompleted:()=>{
              message.info("Removed from admin")
         }
      } 
      
    )

    const  handleRemoveFromAdmin=async(userId:string)=>{
      if(data.getAllClassroomparticipants.admin.length===1){
         message.info("Atleast one admin required");
         return
      }
      await removeFromAdmin({
       variables:{
         id:userId,
         classroomId:code
       }
      })
   }

   //to remove student
   const [removeStudent]=useMutation(REMOVE_STUDENT,
    {
      onError(err){
        message.error("Some error ocuured")
       },
       refetchQueries: [{ query: GET_PARTICIPANTS ,variables:{id:id}}],
       onCompleted:()=>{
            message.info("Removed from the participants")
       }
    } 
    
  )

  const handleRemovestudent=async(id:string)=>{
    await removeStudent({
      variables:{
        code:code,
        userId:id
      }
    })
  }


  //to send inivitation to students
  const [sendInvitation] =useMutation(SEND_INVITATION,{
    onError(err){
      message.error("Some error occurred")
    },
    onCompleted:()=>{
        setopen1(false)
        message.info("Invitation send successfully")
    }
  })

  const handleInvitation=async()=>{
    const invitation={
      fromEmail:token.email as string,
      toEmail:email,
      creator:token.name as string,
      username:'User',
      code:code
    }

    await sendInvitation({
      variables:{
        invitation:invitation
      }
    })
  }

  return (
    <div className='flex justify-center'>
        <div className='w-3/4 my-9'>
            <div className='mb-16'>
                <div className='flex justify-between items-center'>
                <p className='text-3xl text text-[#3b6a87] mx-4'>Teachers</p>
                {
                  creator && 
                  <Tooltip placement="topRight" title={"Add into admins"}>
                <PersonAddAlt1Icon className='text-[#3b6a87] cursor-pointer' onClick={()=>setopen(true)}/>
                </Tooltip>
                }
                
                </div>
           <hr className='border-1 rounded-full border-[#3b6a87] mb-6 mt-3'/>

           {
             data && data.getAllClassroomparticipants.admin.map((admin:ClassroomParticipants)=>{
                return (
                    <>
            <div className='flex my-4 items-center mx-4 justify-between' key={admin.id}>
                      <div className='flex items-center'>
                      <Image src={'/profile-logo.jpg'} width={35} height={35} alt='profile' className='rounded-full'/>
              <p className='mx-5 text text-sm text-slate-900'>{admin.username}</p>
                      </div>
                      {
                        creator && 
                        <Popconfirm
    title="Remove from admin"
    description="Are you sure to remove"
    okText="Yes"
    cancelText="No"
    onConfirm={()=>handleRemoveFromAdmin(admin.id)}
    okButtonProps={{ style: { backgroundColor:"#3b6a87" } }}
  >
                      <PlaylistRemoveIcon className="text-[#3b6a87] cursor-pointer"/>
                      </Popconfirm>
                      }
                      
            </div>
            <hr/>
                    </>
                )
             })
           }
            </div>
            <div className='flex justify-between items-center'>
                <p className='text-3xl text text-[#3b6a87] mx-4'>Students</p>
                {
                  creator && 
                  <Tooltip placement="topRight" title={"Send invitation to student"}>
                  <PersonAddAlt1Icon className='text-[#3b6a87] cursor-pointer' onClick={()=>setopen1(true)}/>
                  </Tooltip>
                }
                
                
                </div>
           <hr className='border-1 rounded-full border-[#3b6a87] mb-6 mt-3'/>
           {
             (data && data.getAllClassroomparticipants.user.length>0) ?data.getAllClassroomparticipants.user.map((user:ClassroomParticipants)=>{
                return (
                    <>
                    <div className='flex my-4 items-center mx-4 justify-between' key={user.id}>
                      <div className='flex items-center'>
                      <Image src={'/profile-logo.jpg'} width={35} height={35} alt='profile' className='rounded-full'/>
              <p className='mx-5 text text-sm text-slate-900'>{user.username}</p>
                      </div>
                      {
                        creator && 
                      
                      <Popconfirm
    title="Add to admin"
    description="Are you sure to add"
    okText="Yes"
    cancelText="No"
    onConfirm={()=>handleRemovestudent(user.id)}
    okButtonProps={{ style: { backgroundColor:"#3b6a87" } }}
  >
   <PlaylistRemoveIcon className="text-[#3b6a87] cursor-pointer"/>
  </Popconfirm>
             }
            </div>

            <hr/>
                    </>
                )
             }):
             <div>
              <Image src={'/nouser.png'} width={500} height={500} alt='photo' className='mx-auto'/>
             </div>
           }
        </div>
        <Modal title="Add to admins" open={open} footer={null} onCancel={()=>setopen(false)} className="text-[#3b6a87]">
        {
             (data && data.getAllClassroomparticipants.user.length>0) ?data.getAllClassroomparticipants.user.map((user:ClassroomParticipants)=>{
                return (
                    <>
                    <div className='flex my-4 items-center mx-4 justify-between' key={user.id}>
                      <div className='flex items-center'>
                      <Image src={'/profile-logo.jpg'} width={35} height={35} alt='profile' className='rounded-full'/>
              <p className='mx-5 text text-sm text-slate-900'>{user.username}</p>
                      </div>
                      {
                        creator && 
                        <Popconfirm
    title="Add to admin"
    description="Are you sure to add"
    okText="Yes"
    cancelText="No"
    onConfirm={()=>handleAddToAdmin(user.id)}
    okButtonProps={{ style: { backgroundColor:"#3b6a87" } }}
  >
    <PlaylistAddIcon className="text-[#3b6a87] cursor-pointer"/>
  </Popconfirm>
                      }
                      
            </div>
            <hr/>
                    </>
                )
             }):
             <div>
              <p className='text-slate-400'>No user  in the students list to add into admin</p>
             </div>
           }
        </Modal>
        <Modal title='Send invitation' open={open1}  footer={null} onCancel={()=>setopen1(false)} className="text-[#3b6a87]">
        <input type="text" className=" w-full p-2 rounded-md focus:outline-none border-slate-300 border-2 my-2 text" placeholder='Enter the email' 
        onChange={(e:ChangeEvent<HTMLInputElement>)=>setemail(e.target.value)}
        />
              <div className="flex justify-end my-2">
              <button type='submit' className="bg-[#3b6a87] p-2 border-2 text-white rounded-md px-4 text " onClick={handleInvitation}>Send</button>
          </div>
        </Modal>
    </div>
  )
}

export default People