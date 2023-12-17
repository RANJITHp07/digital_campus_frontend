import React from 'react'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

function Title({title,settitle}:{title:string,settitle:React.Dispatch<React.SetStateAction<string>>}) {
  return (
    <div className=" w-11/12 mx-auto my-8  box_shadow rounded-md">
    <div className='bg-[#3b6a87] p-4 rounded-t-md flex justify-between items-center'>
      <p className='text-white text text-xl'>Quiz</p>
       <CalendarMonthIcon className='text-white cursor-pointer'/>
    </div>
    <div className='p-5'>
    <input type='text' placeholder='Title' className='text-slate-500 mb-4  focus:outline-none border-b-2 text-2xl placeholder-slate-500' onChange={(e:any)=>settitle(e.target.value)}/>
    <p className='mt-3 text text-slate-500'>Instructions</p>
    <ul className='text-slate-500 text'>
      <li><FiberManualRecordIcon className='text-xs'/> For checkbox questions, choose one or more correct options.</li>
      <li className='my-1'><FiberManualRecordIcon className='text-xs'/> For radio questions, select the single correct answer.</li>
      <li className='my-1'><FiberManualRecordIcon className='text-xs'/> Carefully read all questions and options before choosing.</li>
      <li className='my-1'><FiberManualRecordIcon className='text-xs'/> Submit your answers before the timer expires.</li>
      <li className='my-1'><FiberManualRecordIcon className='text-xs'/> Review your choices; changes can't be made after submission.</li>
      <li className='my-1'><FiberManualRecordIcon className='text-xs'/>  Points are awarded based on correct answers.</li>
    </ul>
    </div>
  </div>
  )
}

export default Title