import React from 'react'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Quiz } from '@/@types/assignment';

interface QuizSubmissionProps{
    title:string,
    quiz:Quiz[],
    dueDate:{
        day:string,
        timer:string[]
    }
}

function QuizSubmission({quiz,title,dueDate}:QuizSubmissionProps) {
    console.log(quiz)
  return (
    <div >
        <div className=" w-11/12 mx-auto my-8  box_shadow rounded-md relative">
        <div className='bg-[#3b6a87] p-4 rounded-t-md flex justify-between items-center'>
      <p className='text-white text text-xl'>Quiz</p>
    </div>
    <div className='p-5'>
        <p className='text-slate-500 mb-4  text-2xl '>Home work one</p>
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
    <div>
    <div  className="w-11/12 mx-auto my-8 box_shadow rounded-md p-4">
    <p className='text text-slate-500 mx-2 text-lg'>1. hwsnwejkpjklsjlklkansklnklnflkxnlfndkjlnlnfsdjlnln</p>
    <div className='flex my-3 mx-2 text-[#3b6a87] '>
        <input type='radio' className="transform scale-150  mx-3 text-[#3b6a87] cursor-pointer  accent-[#3b6a87]" />
    <p className='text'>gootklkfel</p>
    </div>
    <div className='flex my-3 mx-2 text-[#3b6a87] '>
        <input type='radio' className="transform scale-150  mx-3 text-[#3b6a87] cursor-pointer  accent-[#3b6a87]" />
    <p className='text'>gootklkfel</p>
    </div>
    <div className='flex my-3 mx-2 text-[#3b6a87] '>
        <input type='radio' className="transform scale-150  mx-3 text-[#3b6a87] cursor-pointer  accent-[#3b6a87]" />
    <p className='text'>gootklkfel</p>
    </div>
    <div className='flex my-3 mx-2 text-[#3b6a87] '>
        <input type='radio' className="transform scale-150  mx-3 text-[#3b6a87] cursor-pointer  accent-[#3b6a87]" />
    <p className='text'>gootklkfel</p>
    </div>
    
     </div>
    </div>
    </div>
  )
}

export default QuizSubmission