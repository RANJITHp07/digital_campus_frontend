'use client'
import Navbar from '@/app/component/common/navbar'
import React,{ChangeEvent, useState} from 'react'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import YouTubeIcon from '@mui/icons-material/YouTube';
import UploadIcon from '@mui/icons-material/Upload';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { FETCH_CLASSROOM_QUERY, GET_PARTICIPANTS } from '@/apis/classroom/query';
import { useAppSelector } from '@/redux/store';
import { useMutation, useQuery } from '@apollo/client';
import { useSearchParams } from 'next/navigation'
import dayjs, { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';
import { DatePicker, Modal, TimePicker, message } from 'antd';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../../../services/config/firebase"
import { v4 } from "uuid";
import { CREATE_ASSIGNMENT } from '@/apis/assignment/mutation';
import ListIcon from '@mui/icons-material/List';
import { assignmentClient } from '@/app/providers/ApolloProvider';
import CloseIcon from '@mui/icons-material/Close';
import { FETCH_MAINTOPIC } from '@/apis/assignment/query';
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
  const id = searchParams.get('classroom') as string
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
  const {data} = useQuery(FETCH_CLASSROOM_QUERY, { // to get the details of the classrooms the user created
    variables: { id: token.id },
    onCompleted:(data)=>{
       data.getCreatorClassroom.map((m:any)=>{
         if(m._id===id) {
          setname(m.className)
         }
       })
    },
    onError(err){
      message.error("Some error occurred")
    }
  }
  );

  const { data:students }=useQuery(GET_PARTICIPANTS,{
    variables:{
        id:id
    },
    onCompleted:()=>{
      const ids=students.getAllClassroomparticipants.user.map((m:any)=>m.id)
      setStudentchecked(ids)
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
    message.error("Some error occurred")
  },
})

   // to handle the Subjects
  const handleChecked=(c:string)=>{
    if(c==id){
      return
    }
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
      setStudentchecked((prev)=>[...prev,s])
    }

  }

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
      setdate(dateString);
      handleState('state4',!state.state4)
    
  };
  

  //create assignment
  const [createAssignment]=useMutation(CREATE_ASSIGNMENT,
    {
      onError(err){
        message.error("Some error occurred")
        
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

      if(type !=='Material' && point!=='ungraded' ){
        assignment.points=point
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
              const fileType=file.type
              let type;

              if (fileType.startsWith('image/')) {
                type='photo'
              } else if (fileType.startsWith('video/')) {
                type='vedio'
              } else if (fileType === 'application/pdf') {
                 type='pdf'
              } else if (fileType.startsWith('audio/')) {
                type='audio'
              } else {
                message.info('Only audio,vedio,photo and pdf allowed')
              }
              assignment.attachment={
                type:type,
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
              <input type="text" className="w-full bg-slate-200 focus:outline-none p-3 rounded-lg border-2 text my-4 text-slate-600" placeholder='Title of the assignment' 
              onChange={(e:ChangeEvent<HTMLInputElement>)=>settitle(e.target.value)}/>
              <textarea  className="w-full h-3/4 bg-slate-200 focus:outline-none p-3 rounded-lg border-2 text text-slate-600" placeholder='Instruction (optional)'
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setinstruction(e.target.value)}/>
            </div>
            <div className=' mx-3 md:mx-8 xl:mx-24 rounded-lg border-2 h-[8rem] box_shadow my-5 px-3'>
              <p className="text p-2">Attach {file && file.name}</p>
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => setlink(e.target.value)}
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
                  <p className='text text-slate-700 overflow-hidden'>{checked.length>1 ? `${checked.length} classes` :(name.length > 0 && name[0].toUpperCase() + name.slice(1,(name.length>15 ? 15 : name.length)).toLowerCase()+(name.length>15 ? '...' :''))}</p>
                  <ArrowDropDownIcon className='cursor-pointer' onClick={()=>handleState('state1',!state.state1)}/>
                  
                </div>
                {
                  state.state1 && 
                  <div className='absolute bg-white box_shadow  rounded-md w-44'>
                    
                  {
                   data &&  data.getCreatorClassroom.map((c:any)=>{
                    return (
                      <div key={c._id}>
                      <div className={`flex my-1 items-center ${c._id===id && 'bg-slate-200'} p-2`}>
                        <input type='checkbox' className='w-4 h-4 mx-1 cursor-pointer' checked={ c._id===id ? true : checked.includes(c._id)}  onChange={()=>handleChecked(c._id)}/>
                        <p className='text text-slate-700 '>{c.className[0].toUpperCase() + c.className.slice(1,(c.className.length>15 ? 15 : c.className.length)).toLowerCase()+(c.className.length>15 ? '...' :'')}</p>
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
                { type!=='Material' && <>
                <div className='w-1/2 my-5 pr-2'>
                   <p className='text text-slate-700'>Points</p>
                <div className='bg-slate-100 p-2 flex justify-between items-center'>
                  {
                    pointstate ? <input type='text' className='text bg-slate-100 focus:outline-none  text-slate-700 w-1/4 ' value={point} 
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      const isValidKey = /^[0-9]$/.test(e.key);
                      if (!isValidKey) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e:ChangeEvent<HTMLInputElement>)=>
                      {
                        if( parseInt(e.target.value)>0 && parseInt(e.target.value)<101){
                          setpoint(parseInt(e.target.value) )
                        }else{
                          message.info("Mark between 1 to 100")
                        }
                        
                      }
                      }
                    
                    />
                    :<p className='text bg-slate-100 focus:outline-none  text-slate-700 w-1/4 '>ungraded</p>
                  }
                  
                  <ArrowDropDownIcon className='cursor-pointer' onClick={()=>handleState('state2',!state.state2)}/>
                </div>
                {
                    state.state2 && <div className='absolute bg-white box_shadow  cursor-pointer rounded-md p-3'>
                    <p className='text' onClick={()=>{
                      handleState('state2',false);
                      pointstate ? setpoint('ungraded'): setpoint(100)
                      
                      setpointstate(!pointstate)
                    }}>{pointstate ? "Ungraded" : "Points"}</p>
                  </div>

                }
                </div>
                <div className=' my-5 '>
                   <p className='text text-slate-700'>Due Date</p>
                <div className='bg-slate-100 p-2 flex justify-between items-center'>
                  <p className='text text-slate-700'>{date ? date : "No due date"}</p>
                  <ArrowDropDownIcon className='cursor-pointer' onClick={()=>handleState('state4',!state.state4)}/>
                </div>
                {
                  state.state4 && 
                  <div  className='absolute bg-white box_shadow  rounded-md w-56'>
                    <p className='text m-3'>Due Date</p>
                    <hr/>
                    <DatePicker className=' p-2 m-2 border-2 w-11/12' onChange={handleDateChange} />
                    <TimePicker className=' p-2 m-2 border-2 w-11/12' defaultValue={dayjs('23:59', 'HH:mm')} format={'HH:mm'} onChange={(value,time)=>duetime(time)} />
                </div>
                }
                
                </div>
                </>
                }
                <div className=' my-5 '>
                   <p className='text text-slate-700'>Topic</p>
                <div className='bg-slate-100 p-2 flex justify-between items-center'>
                  
                    <input type='text' className='text bg-slate-100 focus:outline-none  text-slate-700 w-1/2 'defaultValue={topic ? topic : "No topic"} onChange={(e:ChangeEvent<HTMLInputElement>)=>settopic(e.target.value)}/>
                   
                  
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
                        settopic(m)
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
                <button className='my-4 w-full bg-slate-200 text border-2 rounded-md p-2' onClick={handleAssign}>Assign</button>
                </div>
            </div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default CreateAssignment