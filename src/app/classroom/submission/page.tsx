'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/app/component/common/navbar'
import SidePanel from '@/app/component/common/sidePanel'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import Assignment from '@mui/icons-material/Assignment'
import { useQuery } from '@apollo/client'
import { ASSIGNMENT_DETAILS } from '@/apis/assignment'
import { assignmentClient } from '@/app/providers/ApolloProvider'

function Submission() {

    const search=useSearchParams()

    const id=search.get('assignment')
    const type=search.get('type')
    console.log(id)
   
    const {data}=useQuery(ASSIGNMENT_DETAILS,{
      client:assignmentClient,
      variables:{
        id:id
      },
      onError(err){
        console.log(err)
      }
    })

  return (
    <div>
        <Navbar/>
        <hr/>
        <div className="flex">
        <div className='border-r-2 z-50 hidden xm:block  min-h-screen '>
              <SidePanel/>
        </div>
        <div className='w-full p-5'>
            {
                data && <>
                <p className='text text-3xl mb-5'>Title: {data.getOneassignment.title}</p>
          <p className='text text-xl'>{data.getOneassignment.instruction && `Instruction: ${data.getOneassignment.instruction}`}</p>
          {
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
          }
                </>
            }
            
          <button className='text-white bg-indigo-950 p-3 w-1/2 my-9 text-center'>Submit</button>
        </div>
        </div>
    </div>
  )
}

export default Submission