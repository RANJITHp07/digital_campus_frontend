'use client'
import Navbar from '@/app/component/common/navbar'
import React,{ChangeEvent, useState} from 'react'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import YouTubeIcon from '@mui/icons-material/YouTube';
import UploadIcon from '@mui/icons-material/Upload';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { FETCH_CLASSROOM_QUERY, GET_PARTICIPANTS } from '@/apis/classroom';
import { useAppSelector } from '@/redux/store';
import { useMutation, useQuery } from '@apollo/client';
import { useSearchParams } from 'next/navigation'
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { DatePicker, Modal, TimePicker, message } from 'antd';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../../../services/config/firebase"
import { v4 } from "uuid";
import { ASSIGNMENT_DETAILS, CREATE_ASSIGNMENT, EDIT_ASSIGNMENT, EDIT_ASSIGNMENT_DETAILS, FETCH_MAINTOPIC } from '@/apis/assignment';
import ListIcon from '@mui/icons-material/List';
import { assignmentClient } from '@/app/providers/ApolloProvider';
import CloseIcon from '@mui/icons-material/Close';
// import { CREATE_ASSIGNMENT } from '@/apis/assignment';


type State = {
  state1: boolean;
  state2: boolean;
  state3:boolean
  state4:boolean
  state5:boolean
};

function CreateAssignment() {

  const searchParams = useSearchParams()
  const classId=searchParams.get('classroom')
  const id = searchParams.get('assignment') as string
  const type=searchParams.get('type')
  const router=useRouter()


    // details of the assignment
    const [point,setpoint]=useState<string | number>(100)
    const [pointstate,setpointstate]=useState(true)
    const [date,setdate]=useState<any>()
    const [time,duetime]=useState<any>()
    const [topic,settopic]=useState<string | null>()
    const[title,settitle]=useState('')
    const [instruction,setinstruction]=useState('')
    const [link,setlink]=useState<string>('')
    const [modal,setmodal]=useState(false)
    const[file,setfile]=useState<File | null>(null)
    const [details,setdetails]=useState<any>({})
    const [checked,setchecked]=useState<string[]>([id])
    const [studentChecked,setStudentchecked]=useState<string[]>([])
    const [name,setname]=useState('')
    const [state,setstate]=useState({
      state1:false,
      state2:false,
      state3:false,
      state4:false,
      state5:false
    })
    const [menu,setmenu]=useState(false)
  const token=useAppSelector((state)=>state.authReducer.token)
  const {data} = useQuery(FETCH_CLASSROOM_QUERY, { // to edit assignment details
    variables: { id: token.id },
    onCompleted:(data)=>{
      console.log(data.getCreatorClassroom)
       data.getCreatorClassroom.map((m:any)=>{
         if(m._id===classId) {
          setname(m.className)
         }
       })
    },
    onError(err){
      console.log(err)
    }
  }
  );

  const { data:students }=useQuery(GET_PARTICIPANTS,{
    variables:{
        id:classId
    },
})

const {data:assignment}=useQuery(EDIT_ASSIGNMENT_DETAILS,{
  client:assignmentClient,
  variables:{
    id:id
  },
  onError(err){
    console.log(id)
    console.log(err)
  },
  onCompleted:(data)=>{
    setdate(data.getOneassignment.dueDate.date)
    setStudentchecked(data.getOneassignment.students)
    setchecked(data.getOneassignment.class_id)
    setdetails(data.getOneassignment)
  }
})

const handleState = ( key: keyof State,value:boolean): void => {
  Object.keys(state).forEach((stateKey) => {
    state[stateKey as keyof State] = false;
  });

  state[key] = value;
  setstate({...state})
};

const {data:mainTopic}=useQuery(FETCH_MAINTOPIC,{
  client:assignmentClient,
  variables:{
    id:id
  },
  onError(err){
    console.log(err)
  },
})

   // to handle the Subjects
  const handleChecked=(c:string)=>{
    if(checked.includes(c)){
       setchecked((prev)=>{
        return prev.filter((p)=>p!=c)
       })
    }else{
      setchecked((prev)=>[...prev,c])
    }
  }

  //to handle all the students
  const handleStudentchecked=(s:string)=>{
    if(studentChecked.includes(s)){
      if(studentChecked.length<=1){
        message.info("Altleast one student required")
        return 
      }
      setStudentchecked((prev)=>{
        return prev.filter((p)=>p!=s)
       })
    }else{
      setchecked((prev)=>[...prev,s])
    }

  }

  // handle the date change
  const handleDateChange = (date:any,dateString:any) => {
   setdetails({...details,dueDate:{
    day:dateString,
    time
   }})

  }  

  //create assignment
  const [createAssignment]=useMutation(CREATE_ASSIGNMENT,
    {
      onError(err){
        console.log(err.message)
        
      },
      onCompleted:()=>{
        message.info("Successfully created");
        router.push(`/classroom/${id}`)
      }
    })


  const handleAssign=async()=>{
    if(studentChecked.length===0){
      message.info("Atleast one student must be there in the clasroom")
      return 
    }
    if(title.trim().length>0){
      const assignment:any={
         title:title,
         class_id:checked,
         students:studentChecked,
         assignmentType:type,
         creator:token.name
      }
      
      if(instruction.trim().length>0) assignment.instruction=instruction
      if(link.trim().length>0){
        assignment.attachment={
          type:"link",
          content:link
        }
      } 
      if(date){
         if(time){
          assignment.dueDate={
            day:date,
            time:time
          }
         }else{
          assignment.dueDate={
            day:date,
            time:'23:59'
          }
         }
      }
      if(topic) assignment.mainTopic=topic

          if(file){
            const imageRef = ref(storage, `images/${file.name + v4()}`);
          uploadBytes(imageRef, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then(async(url) => {
             
              assignment.attachment={
                type:"photo",
                content:url
              }
              console.log(assignment)
              await createAssignment({
                client:assignmentClient,
                variables:{
                  assignment:assignment
                }
              })
              return 
            });
          });
          }else{
            await createAssignment({
              client:assignmentClient,
              variables:
                {
                  assignment
                }
              
            })
          }
          

    }else{
      message.info("Title is must")
    }
     
  }

  const [updateAssignment]=useMutation(EDIT_ASSIGNMENT,{
    client:assignmentClient,
    onError(err){
      console.log(details)
      console.log(err)
    }
  })
  const handleUpdate=async()=>{
     await updateAssignment({
      variables:{
        id:id,
        update:details
      }
     })
  }

  return (
    <div>
        <Navbar/>
        <hr/>
        <div className='flex justify-end m-2 xm:hidden '>
        <button className='text text-white bg-[#3b6a87] px-3 py-1 rounded-md mx-1 md:mx-4' onClick={()=>setmenu(true)}>Dashboard</button>
        </div>
        <div className='flex w-full'>
            <div className='w-full xm:w-[45rem] lg:w-3/4 xl:w-3/4 xm:mt-12'>
            <div className='mx-3 md:mx-8 xl:mx-24 rounded-lg border-2 h-[25rem] box_shadow p-5'>
              <input type="text" className="w-full bg-slate-200 focus:outline-none p-3 rounded-lg border-2 text my-4 text-slate-600" value={details.title} placeholder='Title of the assignment' 
              onChange={(e:ChangeEvent<HTMLInputElement>)=>setdetails({...details,title:e.target.value})}/>
              <textarea  className="w-full h-3/4 bg-slate-200 focus:outline-none p-3 rounded-lg border-2 text" value={details.instruction} placeholder='Instruction (optional)'
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setdetails({...details,instruction:e.target.value})}/>
              
            </div>
            <div className=' mx-3 md:mx-8 xl:mx-24 rounded-lg border-2 h-[8rem] box_shadow my-5 px-3'>
              <p className="text p-2">Attach { details.attachment && details.attachment.type}</p>
              <div className='flex justify-center items-center'>
                <div>
                <div className='flex justify-center items-center p-2 border-2 rounded-full cursor-pointer' onClick={()=>router.push('https://www.youtube.com/')}><YouTubeIcon className="text-red-500 text-3xl"/></div>
                <p className='text-xs text'>Youtube</p>
                </div>
                <div className='mx-16'>
               <label htmlFor='file'><div className='flex justify-center items-center p-2 border-2 rounded-full  cursor-pointer'><UploadIcon className='text-blue-400 text-3xl'/></div></label> 
                <p className='text-xs text text-center'>Upload</p>
                <input type='file' className='hidden' id='file' name='file' onChange={(e:any) =>setfile(e.target.files[0])}/>
                </div>
                 <div >
                <div className='flex justify-center items-center p-2 border-2 rounded-full cursor-pointer' onClick={()=>setmodal(true)}><InsertLinkIcon className='text-3xl'/></div>
                <p className='text-xs text text-center'>Link</p>
                </div>
                 <Modal title='Enter the link' open={modal} footer={null} onCancel={()=>setmodal(false)}>
                 <input
              id="link"
              type="text"
              placeholder="Enter the link"
              className=" block p-3 w-full md:p-2 lg:p-3 border-2 border-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setdetails({...details,attachment:{type:"link",content:e.target.value}})}
            />
            <div className="flex justify-end mt-2">
              <button type='submit' className="bg-slate-300 p-2 border-2 text-slate-700 rounded-md px-4 text " onClick={()=>setmodal(false)}>OK</button>
          </div>
                 </Modal>
              </div>
            </div>
            </div>
            <div
            className={menu ? "fixed top-0 left-0 right-0 bottom-0 flex  bg-black bg-opacity-50 z-50" : ''}
          >
            <div className={menu ? 'bg-white w-[19rem] h-screen absolute right-0' : 'xm:block hidden'}>
              {menu && <CloseIcon className='m-2' onClick={()=>setmenu(!menu)}/>}
            <div className=' w-[19rem] xl:w-1/4 xl:h-[41rem] lg:h-[45rem] xm:h-[40rem] p-5 border-l-2 absolute right-0'>
              <div>
                <div className='flex justify-center items-center'>
                   <div className='w-1/2'>
                   <p className='text text-slate-700'>For</p>
                <div className='bg-slate-100 p-2 flex justify-between items-center'>
                  <p className='text text-slate-700'>{checked.length>1 ? `${checked.length} classes` :(name.length>0 && name[0].toUpperCase() + name.slice(1,name.length).toLowerCase())}</p>
                  <ArrowDropDownIcon className='cursor-pointer' onClick={()=>handleState('state1',!state.state1)}/>
                  
                </div>
                {
                  state.state1 && 
                  <div className='absolute bg-white box_shadow  rounded-md w-44'>
                    
                  {
                   data &&  data.getCreatorClassroom.map((c:any)=>{
                    return (
                      <div key={c._id}>
                      <div className={`flex my-1 items-center ${c._id==classId && 'bg-slate-200'} p-2`}>
                        <input type='checkbox' className='w-4 h-4 mx-1 cursor-pointer' checked={ c._id===classId ? true : checked.includes(c._id)}  onChange={()=>handleChecked(c._id)}/>
                        <p className='text text-slate-700 '>{c.className[0].toUpperCase() + c.className.slice(1,name.length).toLowerCase()}</p>
                      </div>
                      <hr/>
                      </div>
                    )
                   })
                  }
                  </div>
                }
                   </div>
                   <div className='w-1/2 ml-3 mt-6'>
                   <div className='bg-slate-100 p-2 flex justify-between items-center'>
                   <p className='text text-slate-700'>All students</p>
                  <ArrowDropDownIcon className='cursor-pointer' onClick={()=>handleState('state3',!state.state3)}/>
                    </div>
                    {
                       state.state3 && 
                       <div className='absolute bg-white box_shadow  rounded-md w-44'>
                      {
                        students && students.getAllClassroomparticipants.user.map((u:any)=>{
                           return (
                            <div key={u._id}>
                            <div className={`flex my-1 items-center  p-2`}>
                              <input type='checkbox' className='w-4 h-4 mx-1 cursor-pointer'  checked={studentChecked.includes(u.id)} onChange={()=>handleStudentchecked(u.id)}/>
                              <p className='text text-slate-700 '>{u.username[0].toUpperCase() + u.username.slice(1,name.length).toLowerCase()}</p>
                            </div>
                            <hr/>
                            </div>
                           )
                        })
                      }
                   </div>
                    }
              
                   </div>
                </div>
                <div className='w-1/2 my-5 pr-2'>
                   <p className='text text-slate-700'>Points</p>
                <div className='bg-slate-100 p-2 flex justify-between items-center'>
                  {
                    pointstate ? <input type='text' className='text bg-slate-100 focus:outline-none  text-slate-700 w-1/4 'defaultValue={point}/>
                    :<p className='text bg-slate-100 focus:outline-none  text-slate-700 w-1/4 '>ungraded</p>
                  }
                  
                  <ArrowDropDownIcon className='cursor-pointer' onClick={()=>handleState('state2',!state.state2)}/>
                </div>
                {
                    state.state2 && <div className='absolute bg-white box_shadow  cursor-pointer rounded-md p-3'>
                    <p className='text' onClick={()=>{
                      handleState('state2',false);
                      setpoint('ungraded')
                      setpointstate(false)
                    }}>Ungraded</p>
                  </div>

                }
                </div>
                <div className=' my-5 '>
                   <p className='text text-slate-700'>Due Date</p>
                <div className='bg-slate-100 p-2 flex justify-between items-center'>
                  <p className='text text-slate-700'>{details.dueDate ? details.dueDate.day : "No due date"}</p>
                  <ArrowDropDownIcon className='cursor-pointer' onClick={()=>handleState('state4',!state.state4)}/>
                </div>
                {
                  state.state4 && 
                  <div  className='absolute bg-white box_shadow  rounded-md w-56'>
                    <p className='text m-3'>Due Date</p>
                    <hr/>
                    <DatePicker className=' p-2 m-2 border-2 w-11/12' onChange={handleDateChange} />
                    <TimePicker className=' p-2 m-2 border-2 w-11/12' defaultValue={dayjs('23:59', 'HH:mm')} format={'HH:mm'} onChange={(value,time)=>setdetails({...details,dueDate:{...details.dueDate,time:time}})} />
                </div>
                }
                
                </div>
                <div className=' my-5 '>
                   <p className='text text-slate-700'>Topic</p>
                <div className='bg-slate-100 p-2 flex justify-between items-center'>
                  
                    <input type='text' className='text bg-slate-100 focus:outline-none  text-slate-700 w-1/2 'defaultValue={details.mainTopic ? details.mainTopic : "No topic"} onChange={(e:ChangeEvent<HTMLInputElement>)=>setdetails({...details,mainTopic:e.target.value})}/>
                   
                  
                  <ArrowDropDownIcon className='cursor-pointer' onClick={()=>handleState('state5',!state.state5)}/>
                </div>
                {
                  state.state5 && 
                  <div className='absolute bg-white box_shadow  rounded-md w-60'>
                 {
                  mainTopic && mainTopic.getdistinctmainTopic.mainTopic.map((m:string)=>{
                    return (
                      <>
                      <p className='my-2 px-3 cursor-pointer text text-slate-500 ' onClick={()=>
                      {
                        handleState('state5',!state.state5)
                        setdetails({...details,mainTopic:m})
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
                <button className='my-4 w-full bg-slate-200 text border-2 rounded-md p-2' onClick={handleUpdate}>Update</button>
                </div>
            </div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default CreateAssignment