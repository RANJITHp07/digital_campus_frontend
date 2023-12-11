'use client'
import Navbar from '@/app/component/common/navbar'
import React,{ChangeEvent, useState} from 'react'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import type { MenuProps } from 'antd';
import { Dropdown, message } from 'antd';
import TuneIcon from '@mui/icons-material/Tune';
import { Question } from '@/interfaces/assignment';
import EditIcon from '@mui/icons-material/Edit';
import { useMutation } from '@apollo/client';
import { CREATE_ASSIGNMENT } from '@/apis/assignment';
import { useAppSelector } from '@/redux/store';
import { useSearchParams } from 'next/navigation';
import { assignmentClient } from '@/app/providers/ApolloProvider';
import { useRouter } from 'next/navigation';

function Quiz() {

    const data=["A","B","C","D"]
    const router=useRouter()
    const [title,settitle]=useState('')
    const token=useAppSelector((state)=>state.authReducer.token)
    const items: MenuProps['items'] = [
        {
          label: <p onClick={()=>settype('checkbox')}>Multiple answer</p>,
          key: '0',
        },
        {
            type: 'divider',
          },
        {
          label:  <p onClick={()=>settype('radio')}>Single answer</p>,
          key: '1',
        },
        
        
      ];
      
      //quiz details
      const [number,setnumber]=useState(1)
      const [questions,setquestions]=useState<Question[]>([])
      const [question,setquestion]=useState('')
      const [type,settype]=useState<string | null>(null)
      const [options,setoptions]=useState<string[]>([])
      const [option,setoption]=useState('')
      const [editquestion,seteditquestion]=useState('');
      const [editoptions,seteditoptions]=useState<string[]>([])
      const searchParams = useSearchParams()
      const id = searchParams.get('classroom') as string
      const handleAdd=()=>{
        if(question.length===0){
            message.info("Enter the question")
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

      //to enter the options
      const handleOptions = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if(options.length===4){
                
                message.info("Maximum 4 options can be provided");
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
               seteditquestion(m.question)
              return {...m,edit:true}
           }
           return m
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
        const assignment:any={
          title:title,
          class_id:[id],
          students:[''],
          assignmentType:"Quiz",
          creator:token.name
       }
       await createAssignment({
        client:assignmentClient,
        variables:
          {
            assignment
          }
        
      })
      }

  return (
    <div>
        <Navbar/>
        <hr/>
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
        {
  Array.from({ length: number }).map((_, index) => (
    <div key={index} className="w-11/12 mx-auto my-8 box_shadow rounded-md p-4">
      <div className="flex justify-end">
       {!questions[index] ?
        <Dropdown menu={{ items }} trigger={['click']}>
          <TuneIcon className='text-slate-500 cursor-pointer'/>
        </Dropdown>
        :
        <EditIcon className='text-slate-500 cursor-pointer' onClick={()=>handleEdit(index)}/>
        }
        
        
          
      </div>
      <div className='flex'>
      <p className='text text-slate-500 mt-1 text-sm'>{index+1}. </p>
        { !questions[index] ? <input type='text' placeholder=' Enter the question' className='w-full text-slate-500 mb-4 focus:outline-none border-b-2 placeholder-slate-500' onChange={(e:ChangeEvent<HTMLInputElement>)=>setquestion(e.target.value)}/>
        :
        ( !questions[index].edit ? <p className='text text-slate-500 mx-2'>{questions[index].question}</p> 
        :
        <input type='text' placeholder=' Enter the question' className='w-full text-slate-500 mb-4 focus:outline-none border-b-2 placeholder-slate-500' value={editquestion} onChange={(e:ChangeEvent<HTMLInputElement>)=>seteditquestion(e.target.value)}/>
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
        <input type={type==='checkbox'? "checkbox" : "radio"} className="transform scale-150  mx-3 text-[#3b6a87] cursor-pointer  accent-[#3b6a87]" checked={false} />
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

      <div className="flex justify-end mt-4">
        {
            index+1===number   && 
            <>
            
            <button className='px-2 border-2 rounded-md border-slate-500 mx-3' onClick={handleAdd}>Add</button>
        <button className='px-2 text-white rounded-md bg-[#3b6a87]' onClick={handleSubmit}>Submit</button>
            </>
        }
        {
          questions[index] && questions[index].edit &&
          <>
            
            <button className='px-2 border-2 rounded-md border-slate-500 mx-3' onClick={()=>handleRemove(index)}>Remove</button>
        <button className='px-2 text-white rounded-md bg-[#3b6a87]' onClick={()=>handleUpdate(index)}>Update</button>
            </>
        }
      </div>
    </div>
  ))
}

    </div>
  )
}

export default Quiz