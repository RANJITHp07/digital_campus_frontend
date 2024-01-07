'use client'
import { FETCH_ASSIGNMENT_DETAILS } from '@/apis/assignment/query'
import { assignmentClient } from '@/app/providers/ApolloProvider'
import { useQuery } from '@apollo/client'
import PollIcon from '@mui/icons-material/Poll';
import React from 'react'
import AssignmentIcon from '@mui/icons-material/Assignment';
import { format } from 'timeago.js';
import {useRouter} from 'next/navigation';

function Submission({id}:{id:string}) {

    const router=useRouter()
    const {data:allAssignment}=useQuery(FETCH_ASSIGNMENT_DETAILS,{
        client:assignmentClient,
        variables: { id: id },
      })
  return (
    <div className='flex justify-center'>
        <div className=' w-full md:w-3/4 my-9'>
                <div className='flex justify-between items-center'>
                <p className='text-3xl text text-[#3b6a87] mx-4'>Submission</p>
                </div>
                <hr className='border-1 rounded-full border-[#3b6a87] mb-6 mt-3'/>  

        {
                  allAssignment && allAssignment.getAllassignment.map((m:any)=>{
                    if(m.assignmentType==='Assignment' || m.assignmentType==='Polling'){
                     return (
                      <div className='border-2 flex my-12 p-4 rounded-lg bg-white'>
              <div className='w-24 flex justify-center items-center'>
                   <div className={`w-12 h-12 rounded-full flex justify-center items-center bg-[#3b6a87]`}
                   >
                     {
                       m.assignmentType==="Assignment" && <AssignmentIcon className='text-white text-xl'/>
                     }
                     {
                       m.assignmentType==="Polling" && <PollIcon className='text-white text-xl'/>
                     }
                   </div>
              </div>
                      <div className='w-full flex justify-between items-center'>
                      <div>
                     <p className='text text-slate-600 cursor-pointer' onClick={()=>router.push(`/classroom/submitted?assignment=${m._id}&type=${m.assignmentType}`)}>{m.assignmentType}: {m.title}</p>
              
               <p className='text text-xs text-slate-500' >{format(m.createdAt)}</p>
               </div>
              </div>
            </div>
                    
                     )
                    } 

                   })
                }  
                        </div>    
    </div>
  )
}

export default Submission