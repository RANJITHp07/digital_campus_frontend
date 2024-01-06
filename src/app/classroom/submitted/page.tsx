'use client'
import { ASSIGNMENT_DETAILS } from '@/apis/assignment'
import { GET_POLLING } from '@/apis/submission'
import Navbar from '@/app/component/common/navbar'
import SidePanel from '@/app/component/common/sidePanel'
import Polling from '@/app/component/submission/polling'
import { assignmentClient, submissionClient } from '@/app/providers/ApolloProvider'
import { useQuery } from '@apollo/client'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import PollIcon from '@mui/icons-material/Poll';
import  DefaultTable  from '@/app/component/submission/assignment'


function Submitted() {
  const search=useSearchParams()
  const id=search.get('assignment')
  const type=search.get('type')


   // get all assignment details
   const {data,loading}=useQuery(ASSIGNMENT_DETAILS,{
    client:assignmentClient,
    variables:{
      id:id
    },
    onError(err){
      console.log(err)
    }
  })

  const {data:polling}=useQuery(GET_POLLING,{
    client:submissionClient,
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
        <div className='w-full'>
        <div className='text-3lg text  mx-4 my-5 flex items-center'>
          <div className='flex bg-[#3b6a87] w-9 h-9 text-white rounded-full justify-center items-center'><PollIcon/></div>
          <p className='text-[#3b6a87] mx-3'>{type}</p>
          </div>
          <hr/>
          <div className='lg:flex'>
        {data && polling && (
          <div className='my-6 mx-3 w-full'>
            {type === 'Polling' && <Polling details={data && data.getOneassignment} creator={true} polling={polling && polling.getPolling.polling} />}
             {type==='Assignment' && <DefaultTable id={id as string}/>}
          </div>
        )}
      </div>
    </div>
    </div>
    </div>
    
  )
}

export default Submitted