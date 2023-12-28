'use client'
import React ,{ChangeEvent, useState}from 'react'
import AddIcon from '@mui/icons-material/Add';

function Material({assignment}:{assignment:any}) {
  const [file,setfile]=useState<File | null>(null)
  return (
    <div>
        <p className='text text-2xl text-[#3b6a87] mx-6 '>
            {assignment.title.toUpperCase()}
            
          </p>
          <p className='text text-sm mb-3 mt-1 text-[#3b6a87] mx-6'>
            {assignment.instruction}
          </p>
          <input type='file' name='file' id='file' className='hidden' onChange={(e:ChangeEvent<HTMLInputElement>)=> e.target.files && setfile(e.target.files[0])}/>
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
              assignment.dueDate &&
              (
              assignment.dueDate.day +', ' + assignment.dueDate.time
              )
            }
          </span>

    </div>
  )
}

export default Material