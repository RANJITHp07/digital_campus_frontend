import React from 'react'
import AddIcon from '@mui/icons-material/Add';

function Material({assignment}:{assignment:any}) {
  return (
    <div>
        <p className='text text-2xl text-[#3b6a87] mx-6 '>
            {assignment.title.toUpperCase()}
          </p>
          <p className='text text-sm my-3 text-[#3b6a87] mx-6'>
            {assignment.instruction}
          </p>
          <input type='file' name='file' id='file' className='hidden'/>
          <label htmlFor='file'>
            <div className='bg-slate-50 items-center flex justify-center w-32 h-32 outline-dashed outline-2 cursor-pointer outline-slate-500 outline-offset-2 mx-6 rounded-lg'>
              <div className='text-center'>
              <AddIcon className='text-center text-slate-500'/>
              <p className='text-center text-slate-500 text '>Upload</p>
              </div>
            </div>
          </label>
    </div>
  )
}

export default Material