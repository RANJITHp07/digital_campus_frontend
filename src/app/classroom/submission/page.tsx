'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/app/component/common/navbar'
import SidePanel from '@/app/component/common/sidePanel'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useMutation, useQuery } from '@apollo/client'
import { ASSIGNMENT_DETAILS } from '@/apis/assignment'
import { assignmentClient } from '@/app/providers/ApolloProvider'
import PollIcon from '@mui/icons-material/Poll';
import SecurityIcon from '@mui/icons-material/Security';
import GroupIcon from '@mui/icons-material/Group';
import Image from 'next/image'
import Polling from '@/app/component/submission/polling'
import { useAppSelector } from '@/redux/store'
import Material from '@/app/component/submission/material'
import {format} from "timeago.js"
import {pdfjs,Document,Page} from 'react-pdf'
import { CREATE_COMMENT, GET_ALLCOMMENTS } from '@/apis/comment'
import { Comment } from '@/@types/assignment'
import QuizSubmission from '@/app/component/submission/quiz'
import LoadinPage from '@/app/component/common/loadinPage'

function Submission() {

    const search=useSearchParams()
     const token=useAppSelector((state)=>state.authReducer.token)
    const id=search.get('assignment')
    const type=search.get('type')
    const [text,settext]=useState('')
    const [comment,setcomment]=useState<Comment[]>([])   
    const [numPages, setNumPages] = useState(null);
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.js',
      import.meta.url,
    ).toString();
    
  
  
    const onDocumentLoadSuccess = ({ numPages }:{numPages:any}) => {
      setNumPages(numPages);
    };
   
    //get all the comment details
    const {data:comments}=useQuery(GET_ALLCOMMENTS,{
      client:assignmentClient,
      variables:{
        id:id
      },
      onCompleted:(data)=>{
        console.log(data)
        const {__typename,...comment}=data.getAllcomments
        console.log(comment)
        setcomment(comment.publicMessages);
      }
    })

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

    const handleKeyPress = async(e:any) => {
      if (e.key === 'Enter') {
         setcomment([...comment,{username:token.name as string,comment:text}])
         await handleComment('public')
         settext('')
      }
    };

    // create comment

    const [createComment]=useMutation(CREATE_COMMENT,
      {
        client:assignmentClient,
        onError(err){
          console.log(err)
        }
      })


    const handleComment=async(type:string)=>{
      const comment={
        username:token.name,
        assignment_id:id,
        comment:text,
        type:type
      }
      console.log(comment)
      await createComment({
        variables:{
          comment
        }
      })
    }  
  return (
    <div>
      {
        type!=='Quiz' ?
        <>
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
            {
                data && 
                <div className='my-6 mx-3 w-full'>
                
          {
            type==='Polling' && <Polling details={data && data.getOneassignment}/>
          }
          {
            (type==='Assignment' || type==='Material' ) && <Material assignment={data && data.getOneassignment}/>
          }
          {
            type!=='Material' && 
            <button className='text-white bg-[#3b6a87] p-3 w-11/12 lg:w-3/4 my-5 mx-3 text-center text rounded-md'>Submit</button>
          }
        
        <div className='box_shadow p-3 mx-3 w-11/12 lg:w-3/4 rounded-md'>
          <div className={`flex items-center ${comment.length>0 && 'mb-6'}`}>
            <GroupIcon className='text-slate-400 mr-3'/>
          <input placeholder='Add comment to the class' className='placeholder:text focus:outline-none w-full text text-slate-500'
          value={text}
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
                    <p className='text-xs text mx-1 text-slate-500'>{m.username}</p>
                    </div>
             <p className='text text-slate-600 text-xs'>
                {m.comment}
             </p>
          </div>
                )
            })
          }
          
          
        </div>
                </div>
            }
            </div>
            
        </div>
        </div>
        
        </>
      :
      (
         loading ? 
         <div className='w-11/12 mx-auto'>
          <LoadinPage/>
         </div>
          : <QuizSubmission quiz={data && data.getOneassignment.quiz} title={data && data.getOneassignment.title} dueDate={data && data.getOneassignment.dueDate}/>
      )
      

      }
        
    </div>
  )
}

export default Submission