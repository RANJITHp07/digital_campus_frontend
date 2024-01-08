'use client'
import {FETCH_MAINTOPIC } from '@/apis/assignment/query'
import { assignmentClient } from '@/app/providers/ApolloProvider'
import { useQuery } from '@apollo/client'
import { useSearchParams } from 'next/navigation'
import React,{ChangeEvent, useState} from 'react'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import LoadinPage from '@/app/component/common/loadinPage'
import { DatePicker, Dropdown, MenuProps, TimePicker } from 'antd'
import ArrowDropDown from '@mui/icons-material/ArrowDropDown'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TuneIcon from '@mui/icons-material/Tune';
import { EDIT_QUIZ_DETAILS } from '@/apis/assignment/mutation'

function EditQuiz() {
    const searchParams = useSearchParams()
    const id = searchParams.get('assignment') as string
    const [assignment,setAssignment]=useState<any>({})
    const [open,setopen]=useState(false)
    const [modal,setmodal]=useState(false)
    const [topic,setTopic]=useState('')
    const [number,setNumber]=useState(-1)


    const items: MenuProps['items'] = [
      {
        label: (
          <p onClick={()=>handleAnswerType(number)}>
            Change option
          </p>
        ),
        key: '0',
      },
      {
          type: 'divider',
        },
      {
        label:  <p>{"Add options" }</p>,
        key: '1',
      },
      
      
    ]; 

    const {data}=useQuery(FETCH_MAINTOPIC,{
      client:assignmentClient,
      variables:{
        id:id
      },
      onError(err){
        console.log(err)
      },
    })

    const {loading}=useQuery(EDIT_QUIZ_DETAILS,{
        client:assignmentClient,
        variables:{
          id:id
        },
        onError(err){
          console.log(err)
        },
        onCompleted:(data)=>{
          setTopic(data.getOneassignment.mainTopic)
          setAssignment(data.getOneassignment)
        }
      })


      //to change the answer type
      const handleAnswerType=(index:number)=>{
          const type=assignment.quiz.map((m:any,i:number)=>{
            if(index==i){
              if(m.type==='checkbox'){
                return {...m,type:'radio'}
              }else{
                return {...m,type:'checkbox'}
              }
            }
            return m
          })
          setAssignment((prev:any)=>({...prev,quiz:type}))
      }

      //to handle the change of the options of the answer
      const handleChange=(a:string,index:number)=>{
         const answer=assignment.quiz.map((m:any,i:number)=>{
          if(index==i){
            if(m.type==='checkbox'){
              if(m.realAnswers.includes(a)){
                return {...m,realAnswers:m.realAnswers.filter((p:string)=>p!=a)}
              }else{
                return {...m,realAnswers:[...m.realAnswers,a]}
                
              }
              
            }else{
              return {...m,realAnswers:[a]}
             }
          }
          return m
         })
         setAssignment((prev:any)=>({...prev,quiz:answer}))
      }


  return (
    <div className=''>
        {
            loading ? <div className='mx-auto w-11/12'><LoadinPage/></div> 
            :
            <>
       <div className="mx-auto w-11/12 box_shadow my-8">
        {
          modal && 
       <div className='absolute box_shadow right-11 w-60 bg-white top-24 p-3 rounded-sm'>
        <div className='flex border-2 items-center '>
        <input className='cursor-pointer text text-slate-500  p-1 w-full focus:outline-none' placeholder={topic!==''? topic  : 'No topic'} autoFocus />
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
                    setTopic(m)
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
        <TimePicker.RangePicker className='border-2 rounded-none' />
        </div>
        <div className='flex items-center mt-3'>
        <DatePicker className=' border-2  rounded-none w-full'  />
        </div>
        
    </div>

        }
                <div className='bg-[#3b6a87] p-4 rounded-t-md flex justify-between items-center'>
      <p className='text-white text text-xl'>Quiz</p>
      <CalendarMonthIcon className='text-white cursor-pointer' onClick={()=>setmodal(!modal)}/>
    </div>
    <div className='p-5'>
    <input className='text-slate-500 mb-4  focus:outline-none border-b-2 text-2xl placeholder-slate-500' placeholder={assignment.title} autoFocus/>
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
    <div>
    </div>
    </div>
    <div>
        {
           assignment.quiz &&  assignment.quiz.map((q:any,index:number)=>{
                return (
                    <>
                       <div  className="w-11/12 mx-auto my-8 box_shadow rounded-md p-4">
                     <div className='flex justify-between'>
        <p className='text text-slate-500 mx-2 text-lg'>{index+1}. {q.question}</p>
        <Dropdown menu={{ items }} trigger={['click']}>
          <TuneIcon className='text-slate-500 cursor-pointer mx-3' onClick={()=>setNumber(index)}/>
           </Dropdown>
        </div>
        {
            q.answers.map((a:string)=>{
                return (
                    <>
                     <div className='flex my-3 mx-2 text-[#3b6a87] '>
            <input type={q.type==='checkbox'? "checkbox":"radio"} className="transform scale-150  mx-3 text-[#3b6a87] cursor-pointer  accent-[#3b6a87]" checked={q.realAnswers.includes(a)} onChange={(e:ChangeEvent<HTMLInputElement>)=>handleChange(a,index)} />
        <p className='text'>{a}</p>
        </div>
                    </>
                )
            })
        }
         </div>
                    </>
                )
            })
        }
    </div>
    </>
        }

<div className='flex justify-end w-11/12 mx-auto'>
        <button className='p-2 bg-[#3b6a87]  text text-white rounded-md mb-4'>Update</button>
    </div>
    </div>
  )
}

export default EditQuiz