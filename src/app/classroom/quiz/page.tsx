'use client'
import Navbar from '@/app/component/common/navbar'
import React,{ChangeEvent, useState} from 'react'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import type { MenuProps } from 'antd';
import { Dropdown, message } from 'antd';
import TuneIcon from '@mui/icons-material/Tune';
import EditIcon from '@mui/icons-material/Edit';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_ASSIGNMENT } from '@/apis/assignment';
import { useAppSelector } from '@/redux/store';
import { useSearchParams } from 'next/navigation';
import { assignmentClient } from '@/app/providers/ApolloProvider';
import { useRouter } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import { Question } from '@/@types/assignment';
import { FETCH_CLASSROOM_DETAILS } from '@/apis/classroom';
import Title from '@/app/component/classroom/quiztitle';

function Quiz() {


  const [editquestion,seteditquestion]=useState('');
  const [editoptions,seteditoptions]=useState<string[]>([])
  const [edittype,setEdittype]=useState<string| null>(null)
  const [editoption,setEditoption]=useState('')
  const [edit,setEdit]=useState(false)
  const items: MenuProps['items'] = [
    {
      label: <p onClick={ edittype? ()=>{
        edittype==='checkbox'?setEdittype('radio'):setEdittype('checkbox')
      }
      :
        ()=>settype('checkbox')}>{edittype ? "Change option" : "Multiple answer"}</p>,
      key: '0',
    },
    {
        type: 'divider',
      },
    {
      label:  <p onClick={edittype? ()=>
        {
          if(editoptions.length===4){
            message.error("Maximum 4 options")
          }
          setEdit(true)
        }
        :()=>settype('radio')}>{edittype ? "Add options" : "Single answer"}</p>,
      key: '1',
    },
    
    
  ]; 

    const data=["A","B","C","D"]
    const router=useRouter()
    const [title,settitle]=useState('')
    const token=useAppSelector((state)=>state.authReducer.token)
      
      //quiz details
      const [number,setnumber]=useState(1)
      const [questions,setquestions]=useState<Question[]>([])
      const [question,setquestion]=useState('')
      const [type,settype]=useState<string | null>(null)
      const [options,setoptions]=useState<string[]>([])
      const [option,setoption]=useState('')
      const searchParams = useSearchParams()
      const id = searchParams.get('classroom') as string

      //classroom details
      const { data:classroom } = useQuery(FETCH_CLASSROOM_DETAILS, {
        variables: { id: id },
        onCompleted:(data)=>{
          console.log(data)
        }
      });


      const handleAdd=()=>{
        if(question.length===0){
            message.info("Enter the question")
            return 
        }
        if(!type){
          message.error("Choose the answer type")
          return
        }
        if(options.length<2){
          message.error("Atleast 2 options")
          return
        }
        const q={
            type:type as string,
            question:question,
            answers:options,
            edit:false
        }
        setquestions([...questions,q])
        setnumber(number+1)
        setoptions([])
        settype(null)
      }

      
      //to edit the options
      const handleEditOptions= (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if(editoptions.length===4){
                
                message.info("Maximum 4 options can be provided");
                return
            }
            if(editoptions.length<2){
              message.info("Minimum 2 options must be provided");
              return
            }
          seteditoptions([...editoptions, editoption]);
          setEditoption('')
          
        }
      };

      //to enter the options
      const handleOptions = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if(options.length===4){
                message.info("Maximum 4 options can be provided");
                return
            }
            if(option.trim().length==0){
              message.error("Give input to option")
              return
            }
          setoptions([...options, option]);
          setoption('')
          
        }
      };

      //to edit the questions
      const handleEdit=(i:number)=>{
        const a= questions.map((m,index)=>{
           if(i===index){
               seteditoptions(m.answers);
               setEdittype(m.type)
               seteditquestion(m.question)
              return {...m,edit:true}
           }
           return {...m,edit:false}
        })
        setquestions(a)
      }

      //to remove a question
      const handleRemove=(i:number)=>{
          const a=questions.filter((m,index)=>index!=i)
          setquestions(a)
          setnumber(number-1)
      }

      //to update the  quiz questions
      const  handleUpdate=(i:number)=>{
        const a= questions.map((m,index)=>{
          if(i===index){
             return {...m,edit:false,question:editquestion,answers:editoptions}
          }
          return m
       })
       setquestions(a)
       
      }
     
      const [createAssignment]=useMutation(CREATE_ASSIGNMENT,
        {
          onError(err){
            console.log(err)
            
          },
          onCompleted:()=>{
            message.info("Successfully created");
            router.push(`/classroom/${id}`)
          }
        })
      const handleSubmit=async()=>{
        if(title.trim().length==0){
           message.info("Title is must")
           return 
        }

        let q=questions.map(({ edit, ...rest }) => rest)
        if(question.trim().length>0 && options.length>0){
          q = [...q, { question: question, answers: options, type: type as string }];
        }
        const assignment:any={
          title:title,
          class_id:[id],
          students: classroom && classroom.getClassroomDetails.students_enrolled,
          assignmentType:"Quiz",
          creator:token.name,
          quiz:q
       }
       console.log(assignment)
      //  await createAssignment({
      //   client:assignmentClient,
      //   variables:
      //     {
      //       assignment
      //     }
        
      // })
      }

  return (
    <div>
        <Navbar/>
        <hr/>
        <Title title={title} settitle={settitle}/>
        {
  Array.from({ length: number }).map((_, index) => (
    <div key={index} className="w-11/12 mx-auto my-8 box_shadow rounded-md p-4">
      <div className="flex justify-end">
      {questions[index] &&
      <>
        <EditIcon className='text-slate-500 cursor-pointer' onClick={()=>handleEdit(index)}/>
        {
          questions[index].edit
          && 
          <Dropdown menu={{ items }} trigger={['click']}>
          <TuneIcon className='text-slate-500 cursor-pointer mx-3'/>
           </Dropdown>
        }
        </>
      }
       {
        !questions[index] && !edittype && 
          <Dropdown menu={{ items }} trigger={['click']}>
          <TuneIcon className='text-slate-500 cursor-pointer'/>
        </Dropdown>
       }
        
      
        
        
          
      </div>
      <div className='flex'>
      <p className='text text-slate-500 mt-1 text-sm'>{index+1}. </p>
        { !questions[index] ? <input type='text' placeholder=' Enter the question' className='w-full text-slate-500 mb-4 focus:outline-none border-b-2 placeholder-slate-500' onChange={(e:ChangeEvent<HTMLInputElement>)=>setquestion(e.target.value)}/>
        :
        ( !questions[index].edit ? <p className='text text-slate-500 mx-2'>{questions[index].question}</p> 
        :
        <div  className='flex'>
        <input type='text' placeholder=' Enter the question' className='w-full text-slate-500 mb-4 focus:outline-none border-b-2 placeholder-slate-500' value={editquestion} onChange={(e:ChangeEvent<HTMLInputElement>)=>seteditquestion(e.target.value)}/>
        </div>
        )
       }
       

      </div>
      {
        !questions[index] ? options.map((p,index)=>{
            return (
                <div className='flex my-3 text-[#3b6a87]'>
                <p>{data[index]}. </p>
        <input type={type==='checkbox'? "checkbox" : "radio"} className="transform scale-150  mx-3 text-[#3b6a87] cursor-pointer  accent-[#3b6a87]" checked={false} />
          <p>{p}</p>
       </div>
            )
        })
        :
        (
          questions[index].edit && 
          editoptions.map((p,index)=>{
            return (
                <div className='flex my-3 text-[#3b6a87]'>
                <p>{data[index]}. </p>
        <input type={edittype==='checkbox'? "checkbox" : "radio"} className="transform scale-150  mx-3 text-[#3b6a87] cursor-pointer  accent-[#3b6a87]" checked={false} /> 
        <input type='text' placeholder={`Option ${data[options.length]}`} className='border-b-2  text border-slate-100 focus:outline-none placeholder-slate-500' 
            value={editoptions[index]}
            onChange={(e:ChangeEvent<HTMLInputElement>)=>{
              const a=editoptions.map((m,i)=>{
                if(i===index){
                  return e.target.value
                }
                return m
              })
              seteditoptions(a)
            }}
            />
            <CloseIcon className='text-slate-300' onClick={()=>{
              if(editoptions.length<=2){
                message.error("Minmum 2 options");
                return
              }
              const a=editoptions.filter((a,i)=>index!==i)
              seteditoptions(a)
            }}/>
       </div>
            )
        })
        )
        
      }
      {
        (type &&  options.length < 4 && !questions[index]  ) && (
            <div className='flex my-3 text-[#3b6a87]'>
        <input type={type==='checkbox'? "checkbox" : "radio"} className="transform scale-150  mr-3 text-[#3b6a87] cursor-pointer  accent-[#3b6a87]" checked={false} />
          <input type='text' placeholder={`Option ${data[options.length]}`} className='border-b-2  text border-slate-100 focus:outline-none placeholder-slate-500' 
          value={option}
          onChange={(e:ChangeEvent<HTMLInputElement>)=>setoption(e.target.value)}
          onKeyDown={handleOptions}
          />
       </div>
        )
       }
       {
        editoptions.length< 4  && edit && <div className='flex my-3 text-[#3b6a87]'>
        <input type={type==='checkbox'? "checkbox" : "radio"} className="transform scale-150  mr-3 text-[#3b6a87] cursor-pointer  accent-[#3b6a87]" checked={false} />
          <input type='text' placeholder={`Option`} className='border-b-2  text border-slate-100 focus:outline-none placeholder-slate-500' 
          value={editoption}
          onChange={(e:ChangeEvent<HTMLInputElement>)=>setEditoption(e.target.value)}
          onKeyDown={handleEditOptions}
          />
       </div>
       }
       {
         questions[index] && !questions[index].edit &&
          questions[index].answers.map((p,i)=>{
            return (
              <div className='flex my-3 text-[#3b6a87]'>
              <input type={questions[index].type==='checkbox'? "checkbox" : "radio"} className="transform scale-150  mx-3 text-[#3b6a87] cursor-pointer  accent-[#3b6a87]" checked={false} />
              <p>{p}</p>
             </div>
            )
          })
       }
      {/* <div className='flex my-3'>
        <input type="radio" className="transform scale-150 mr-3 text-[#3b6a87] cursor-pointer  accent-[#3b6a87]" checked />
          <input type='text' placeholder='Enter the answer' className='border-b-2  text border-slate-300 focus:outline-none placeholder-slate-500' 
          onKeyDown={()=>{}}
          />
       </div> */}

      <div className="  mt-4">
        {
            index+1===number   && 
            <div className="flex  justify-end mt-4 w-full">
            <button className='px-2 border-2 rounded-md border-slate-500 mx-3' onClick={handleAdd}>Add</button>
        <button className='px-2 text-white rounded-md bg-[#3b6a87]' onClick={handleSubmit}>Submit</button>
            </div>
        }
        {
          questions[index] && questions[index].edit &&
          <div className="flex justify-end mt-4 w-full">
                        <div>
            <button className='px-2 border-2 rounded-md border-slate-500 mx-3' onClick={()=>handleRemove(index)}>Remove</button>
        <button className='px-2 text-white rounded-md bg-[#3b6a87]' onClick={()=>handleUpdate(index)}>Updated</button>
        </div>
            </div>
        }
      </div>
    </div>
  ))
}

    </div>
  )
}

export default Quiz