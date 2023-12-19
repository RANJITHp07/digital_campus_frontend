'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/app/component/common/navbar'
import SidePanel from '@/app/component/common/sidePanel'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@apollo/client'
import { ASSIGNMENT_DETAILS } from '@/apis/assignment'
import { assignmentClient } from '@/app/providers/ApolloProvider'
import AssignmentIcon from '@mui/icons-material/Assignment';
import PollIcon from '@mui/icons-material/Poll';
import HelpIcon from '@mui/icons-material/Help';
import SecurityIcon from '@mui/icons-material/Security';
import GroupIcon from '@mui/icons-material/Group';
import Image from 'next/image'
import Polling from '@/app/component/submission/polling'
import { useAppSelector } from '@/redux/store'
import Material from '@/app/component/submission/material'

function Submission() {

    const search=useSearchParams()
     const token=useAppSelector((state)=>state.authReducer.token)
    const id=search.get('assignment')
    const type=search.get('type')
    const [text,settext]=useState('')
    const [comment,setcomment]=useState<string[]>([])
   
    const {data}=useQuery(ASSIGNMENT_DETAILS,{
      client:assignmentClient,
      variables:{
        id:id
      },
      onError(err){
        console.log(err)
      }
    })

    const handleKeyPress = (e:any) => {
      if (e.key === 'Enter') {
         setcomment([...comment,text])
         settext('')
      }
    };
  return (
    <div>
        <Navbar/>
        <hr/>
        <div className="flex">
        <div className='border-r-2 z-50 hidden xm:block  min-h-screen '>
              <SidePanel/>
        </div>
        <div className='w-full'>
        <div className='text-3xl text  mx-4 my-5 flex items-center'>
          <div className='flex bg-[#3b6a87] w-9 h-9 text-white rounded-full justify-center items-center'><PollIcon/></div>
          <p className='text-[#3b6a87] mx-3'>{type}</p>
          </div>
          <hr/>
          <div className='flex'>
            {
                data && 
                <div className='my-6 mx-3 w-2/3'>
                
          {
            type==='Polling' && <Polling details={data && data.getOneassignment}/>
          }
          {
            (type==='Assignment' || type==='Material' ) && <Material/>
          }
        <button className='text-white bg-[#3b6a87] p-3 w-3/4 my-5 mx-3 text-center text rounded-md'>Submit</button>
        <div className='box_shadow p-3 mx-3 w-3/4 rounded-md'>
          <div className='flex items-center mb-6'>
            <GroupIcon className='text-slate-400 mr-3'/>
          <input placeholder='Add comment to the class' className='placeholder:text focus:outline-none w-full'
           onChange={(e:any)=>settext(e.target.value)}
           onKeyPress={handleKeyPress}
          />
          </div>
          {
            comment.map((m)=>{
                return (
                  <div className='border-2 p-3 rounded-md my-3'>
          <div className='flex items-end '>
                    <Image src={'/profile.jpg'} width={20} height={20} alt='profile' className='rounded-full'/>
                    <p className='text-xs text mx-1 text-slate-500'>{token.name}</p>
                    </div>
             <p className='text text-slate-600 text-xs'>
                {m}
             </p>
          </div>
                )
            })
          }
          
          {/* <div className='border-2 p-3 rounded-md my-3'>
          <div className='flex items-end '>
                    <Image src={'/profile.jpg'} width={20} height={20} alt='profile' className='rounded-full'/>
                    <p className='text-xs text mx-1 text-slate-500'>James</p>
                    </div>
             <p className='text text-slate-600 text-xs'>
                is this the task we need to complete by today
             </p>
          </div>
          <div className='border-2 p-3 rounded-md my-3'>
          <div className='flex items-end '>
                    <Image src={'/profile.jpg'} width={20} height={20} alt='profile' className='rounded-full'/>
                    <p className='text-xs text mx-1 text-slate-500'>James</p>
                    </div>
             <p className='text text-slate-600 text-xs'>
                is this the task we need to complete by today
             </p>
          </div> */}
        </div>
          {/* {
            data.getOneassignment.attachment ?
            <div>
                <p className='text text-xl'>Attachment:</p>
                <img src={data.getOneassignment.attachment.content}/>
            </div>
            :<p className='text text-xl'>No attachment</p>
          }
          {
           data.getOneassignment.dueData && 
            <div className='flex'>
                <p className='text text-xl'>DueDate: {data.getOneassignment.dueDate.day}</p>
            </div>
          } */}
                </div>
            }
            <div className='w-1/3'>
              <div className='box_shadow  mr-9 p-3 rounded-md  my-6'>
                <p className='text text-[#3b6a87]'>Created By Ranjith</p>
                <p className='text text-[#3b6a87] text-xs'>27 seconds ago</p>
                <div className='flex mt-4'>
                  <SecurityIcon className='text-slate-400 mr-3'/>
                <input placeholder='Add private comment' className='placeholder:text focus:outline-none'/>
                </div>
                <div className='border-2 p-3 rounded-md my-3'>
          <div className='flex items-end '>
                    <Image src={'/profile.jpg'} width={20} height={20} alt='profile' className='rounded-full'/>
                    <p className='text-xs text mx-1 text-slate-500'>James</p>
                    </div>
             <p className='text text-slate-600 text-xs'>
                is this the task we need to complete by today
             </p>
          </div>
              </div>
            </div>
            </div>
            
        </div>
        </div>
    </div>
  )
}

export default Submission