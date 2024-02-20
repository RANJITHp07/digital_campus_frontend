'use client'
import { ASSIGNMENT_DETAILS } from '@/apis/assignment/query'
import { GET_POLLING } from '@/apis/submission/query'
import Navbar from '@/app/component/common/navbar'
import SidePanel from '@/app/component/common/sidePanel'
import Polling from '@/app/component/submission/polling'
import { assignmentClient, submissionClient } from '@/app/providers/ApolloProvider'
import { useQuery } from '@apollo/client'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import PollIcon from '@mui/icons-material/Poll';
import  DefaultTable  from '@/app/component/submission/assignment'
import QuizMark from '@/app/component/submission/quizMark'
import { useAppSelector } from '@/redux/store'


function Submitted() {
  const search=useSearchParams()
  const token = useAppSelector((state) => state.authReducer.token);
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
    },
  })

  const {data:polling}=useQuery(GET_POLLING,{
    client:submissionClient,
    variables:{
      id:id
    },
    onError(err){
      console.log(err)
    },
  })


  return (
    <div>
       <Navbar/>
        <hr/>
        <div className="flex">
        <div className='border-r-2 z-50 hidden xm:block  min-h-screen '>
              <SidePanel/>
        </div>
        <div className='w-full xm:w-10/12'>
        <div className='text-3lg text  mx-4 my-5 flex items-center'>
          <div className='flex bg-[#3b6a87] w-9 h-9 text-white rounded-full justify-center items-center'><PollIcon/></div>
          <p className='text-[#3b6a87] mx-3'>{type}</p>
          </div>
          <hr/>
          <div className='lg:flex'>
        {data && polling && (
          <div className='my-6 mx-3 w-11/12'>
            {type === 'Polling' && <Polling admin={true} details={data && data.getOneassignment} creator={data.getOneassignment.students.includes(token.id)} polling={polling.getPolling && polling.getPolling.polling} />}
             {type==='Assignment' && <DefaultTable id={id as string} name={data && data.getOneassignment.title}/>}
             {
              type==='Quiz' && <QuizMark id={id as string} data={data && data.getOneassignment}/>
             }
          </div>
        )}
      </div>
    </div>
    </div>
    </div>
    
  )
}

export default Submitted