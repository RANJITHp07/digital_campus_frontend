'use client'
import React,{useState} from 'react'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Modal, Tooltip, message } from 'antd';
import { ADD_REQUEST, ADD_STUDENT, FETCH_REQUEST_DETAILS, REMOVE_REQUEST} from '@/apis/classroom';
import { useMutation, useQuery } from '@apollo/client';
import { useAppSelector } from '@/redux/store';
import PersonIcon from '@mui/icons-material/Person';
import UserDetail from './userDetail';
import Image from 'next/image'
import LoadinPage from '../common/loadinPage';
import { RequestUser } from '@/@types/users';

interface RequestProps{
  id:string,
  code:string
}


function Request({id,code}:RequestProps) {

  const [open,setOpen]=useState<{open:boolean,email:string}>({
    open:false,
    email:''
  })

  ///to  join into the class
   const [joinStudent]=useMutation(ADD_STUDENT,{
      onError(err){
        console.log(err)
           message.info(err.graphQLErrors[0].message)
      },
      refetchQueries: [{ query:FETCH_REQUEST_DETAILS ,variables:{id:id}}
      ],
      onCompleted: () => {
        message.info("Succesfully added")
      }
   })

   //to fetch request
   const {data,loading}=useQuery(FETCH_REQUEST_DETAILS,{
    onError(err){
      message.info("Some error occured")
    },
    variables:{
      id:id
    },
   })


   const [removeRequest]=useMutation(REMOVE_REQUEST,{
    onError(err){
      console.log(err)
      message.info("Some error occured")
    },
    refetchQueries: [{ query:FETCH_REQUEST_DETAILS ,variables:{id:id}}],
    onCompleted: () => {
      message.info("Succesfully removed")
    }
   })

   const handleRemoverequest=(p:RequestUser)=>{
    console.log(p)
     const {__typename,...data}=p
      removeRequest({
        variables:{
          request:{
            ...data,
            code:code
          }
        }
      })
   }


   const handleJoin=async(id:string)=>{
       await joinStudent({
        variables:{
          userId:id,
          code:code
        }
       })
   }

  return (
    <div className='flex justify-center'>
      {
        loading ? <LoadinPage/> :
      
         <div className='w-full md:w-3/4 my-9'>
            <div className='mb-9'>
                <div className='flex justify-between items-center'>
                <p className='text-3xl text text-[#3b6a87] mx-4'>Request</p>
                </div>
           <hr className='border-1 rounded-full border-[#3b6a87] mb-6 mt-3'/>
           </div>
           {
            data && data.getClassroomDetails.request.map((s:RequestUser)=>{
              return (
                <>
                {console.log(s)}
                <div className='flex items-center justify-between text-slate-500'>
              <p className='mx-5 text  '><PersonIcon/> {s.name}</p>
              <div>
              <Tooltip placement="topRight" title={"Remove request"}>
              <PlaylistRemoveIcon className='cursor-pointer' onClick={()=>handleRemoverequest(s)}/>
              </Tooltip>
              <Tooltip placement="topRight" title={"Add to classroom"}>
              <DownloadDoneIcon className='mx-3 cursor-pointer' onClick={()=>handleJoin(s.id)}/>
              </Tooltip>
              <Tooltip placement="topRight" title={"View Profile"}>
              <RemoveRedEyeIcon className='cursor-pointer' onClick={()=>
                setOpen((prev)=>({...prev,email:s.email,open:true}))}/>
              </Tooltip>
              <Modal open={open.open} title={<span className='text font-normal'>User Details</span>} footer={null} onCancel={()=>setOpen((prev)=>({...prev,open:false}))}>
                <UserDetail email={open.email}/>
              </Modal>
              </div>
                      </div>
                      <hr className='my-5'/>
                </>
              )
            })

           }
           {
            data && data.getClassroomDetails.request.length==0 && <Image src={'/request.png'} width={400} height={400} alt='request' className='mx-auto' />
           }
                     
           </div>
       }
    </div>
  )
}

export default Request