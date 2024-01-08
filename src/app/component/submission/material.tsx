'use client'
import React ,{ChangeEvent, useState}from 'react'
import AddIcon from '@mui/icons-material/Add';
import { useMutation } from '@apollo/client';
import { CREATE_SUBMISSION } from '@/apis/submission/mutation';
import { useAppSelector } from '@/redux/store';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../../../services/config/firebase"
import { v4 } from "uuid";
import { submissionClient } from '@/app/providers/ApolloProvider';
import { message } from 'antd';

function Material({assignment}:{assignment:any,admin:boolean}) {
  const [file,setfile]=useState<File | null>(null)
 const token=useAppSelector((state)=>state.authReducer.token)

  const [createSubmission]=useMutation(CREATE_SUBMISSION,{
    onError(err){
      console.log(err)
    },
    onCompleted:(data)=>{
      console.log(data)
        message.info(data.createSubmission.message)
    }
  })

  const imagesListRef = ref(storage, "images/");

  const handleSubmission=async()=>{
    const submission:any={
      assignment_id:assignment._id,
      username:token.name,
      user_id:token.id,
      attachment:{
        type:'photo',
        content:''
      }
    }
    
    if(assignment.dueDate && assignment.dueDate.day){
      const assignmentDueDate = new Date(assignment.dueDate.day);
      const currentDate = new Date();
      
     
      assignmentDueDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      if (assignmentDueDate.toDateString() === currentDate.toDateString()) {
         submission.submission={
           status:'Submitted'
         }
      } else if (assignmentDueDate < currentDate) {
        submission.submission={
          status:'Late submitted'
        }
      } else {
        submission.submission={
          status:'Submitted'
        }
      }
    }
    if(file){
      const imageRef = ref(storage, `images/${file.name + v4()}`);
      await uploadBytes(imageRef, file).then(async(snapshot:any) => {
        await getDownloadURL(snapshot.ref).then(async(url) => {
            submission.attachment={
             type:'phot',
               content:url
            }
           })
          })
    }

    console.log(submission)

     await createSubmission({
      client:submissionClient,
      variables:{
        submission
        }
      }
     )
  }


  return (
    <div>
       {
        <div>
        {
          assignment.assignmentType==='Assignment' &&
        <a href={assignment.attachment ? assignment.attachment.content : ''} target='_blank' className="absolute right-3 p-2 text-white bg-[#3b6a87] text rounded-md  hidden lg:block">Attachement</a>
       }
        <p className='text text-2xl text-[#3b6a87] mx-6 '>
            {assignment.title.toUpperCase()}
            <span className=" text-[#3b6a87] text rounded-md text-xs  mx-2 underline  lg:hidden">{ assignment.assignmentType==='Assignment' && "Attachement" }</span>
          </p>
          {   assignment.assignmentType!=='Assignment' &&
              <a className=" p-2  text-[#3b6a87] mx-6 border-2  my-7 text rounded-md  ">Attachement a {assignment.attachment && assignment.attachment.type}</a>
          }
          <p className='text text-sm mb-3 mt-1 text-[#3b6a87] mx-6'>
            {assignment.instruction}
          </p>
          <input type='file' name='file' id='file' className='hidden' onChange={(e:ChangeEvent<HTMLInputElement>)=> e.target.files && setfile(e.target.files[0])}/>
          {
            assignment.assignmentType==='Assignment' && 
          <>
          <div className='flex items-center'>
          <label htmlFor='file'>
            <div className='bg-slate-50 items-center flex justify-center w-32 h-32 outline-dashed outline-2 cursor-pointer outline-slate-500 outline-offset-2 mx-6 rounded-lg'>
              <div className='text-center'>
              <AddIcon className='text-center text-slate-500'/>
              <p className='text-center text-slate-500 text '>Upload</p>
              </div>
            </div>
          </label>
          {
            file && <p className='text text-sm'>{file.name}</p>
          }
          </div>
          <span className='text-xs text text-[#3b6a87] mx-6'>
           Due date: {
              (assignment.dueDate && assignment.dueDate.day )
              ?
              (
              assignment.dueDate.day +', ' + assignment.dueDate.time
              ):
              "No due Date"
            }
          </span>
          </>
          }
          </div>
        }

          {
            assignment.assignmentType!=='Material' && 
            <button className='text-white bg-[#3b6a87] p-3 w-11/12 lg:w-3/4 my-5 mx-3 text-center text rounded-md' onClick={handleSubmission}>Submit</button>
          }
    </div>
  )
}

export default Material