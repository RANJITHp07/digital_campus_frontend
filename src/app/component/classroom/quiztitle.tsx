'use client'
import React,{ChangeEvent, useState} from 'react'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useQuery } from '@apollo/client';
import { FETCH_MAINTOPIC } from '@/apis/assignment';
import { assignmentClient } from '@/app/providers/ApolloProvider';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import { DatePicker, TimePicker, message } from 'antd';
import { Dayjs } from 'dayjs';

function Title({id,settitle,topic,settopic,settimer,setdate}:
  {id:string,settitle:React.Dispatch<React.SetStateAction<string>>,
  topic:string | null,
  settopic:React.Dispatch<React.SetStateAction<string| null>>
  settimer:React.Dispatch<React.SetStateAction<string[]>>
  setdate:React.Dispatch<React.SetStateAction<string>>
}) {

   const [open,setopen]=useState(false)
   const [modal,setmodal]=useState(false)
  const {data}=useQuery(FETCH_MAINTOPIC,{
    client:assignmentClient,
    variables:{
      id:id
    },
    onError(err){
      message.info("Some error occurred")
    },
  })

  const handleDateChange = (value: Dayjs | null, dateString: string) => {
    if (value === null) {
      return;
    }
    const selectedDate = new Date(dateString);
    const currentDate = new Date();

    selectedDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

    if (selectedDate < currentDate) {
      message.error("Selected date is before the current date");
      return
    } 
    setdate(dateString)
  };

  return (
    <div className=" w-11/12 mx-auto my-8  box_shadow rounded-md relative">
      { modal &&
      <div className='absolute box_shadow right-2 w-60 bg-white top-11 p-3 rounded-sm'>
        <div className='flex border-2 items-center '>
        <input className='cursor-pointer text text-slate-500  p-1 w-full focus:outline-none' placeholder={topic? topic : 'No topic'} autoFocus onChange={(e:ChangeEvent<HTMLInputElement>)=>settopic(e.target.value)}/>
    <ArrowDropDown onClick={()=>setopen(!open)} className="cursor-pointer"/>
    {
      open && 
    <div className='absolute bg-white top-12 w-52  p-2 rounded-sm right-4 box_shadow z-50'>
    {
             data && data.getdistinctmainTopic.mainTopic.map((m:string)=>{
               return (
                 <>
                 <p className='my-3 cursor-pointer text text-slate-500' onClick={()=>
                  {
                    settopic(m)
                    setopen(false)
                  }
                }>{m}</p>
                 <hr/>
                 </>
                 
               )
             })
            }
        </div>
      }
        </div>
        <div className='flex items-center my-3'>
        <TimePicker.RangePicker className='border-2 rounded-none' onChange={(value,time)=>settimer(time)}/>
        </div>
        <div className='flex items-center mt-3'>
        <DatePicker className=' border-2  rounded-none w-full'  onChange={handleDateChange}/>
        </div>
        
    </div>
    }
    <div className='bg-[#3b6a87] p-4 rounded-t-md flex justify-between items-center'>
      <p className='text-white text text-xl'>Quiz</p>
       <CalendarMonthIcon className='text-white cursor-pointer' onClick={()=>setmodal(!modal)}/>
    </div>
    
    <div className='p-5'>
    <input type='text' placeholder='Title' className='text-slate-500 mb-4  focus:outline-none border-b-2 text-2xl placeholder-slate-500' onChange={(e:ChangeEvent<HTMLInputElement>)=>settitle(e.target.value)}/>
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