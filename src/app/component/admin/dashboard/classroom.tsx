'use client'
import React, { ChangeEvent,useState } from 'react'
import {  UPDATE_CLASSROOM_DETAILS } from '../../../../apis/classroom/mutation'
import { useMutation, useQuery } from '@apollo/client'
import { Pagination, message } from 'antd'
import { GET_CLASSROOMS } from '@/apis/classroom/query'

function Classroom() {
   
    const {data}=useQuery(GET_CLASSROOMS,{
        onCompleted:(data)=>{
             setclassroom(data.getclassroom)
        }
    })
    const [pagination,setpagination]=useState(1)
    const [blocked,setblocked]=useState<any>({})
    const [text,settext]=useState('');
    const[classroom,setclassroom]=useState([])
    
   const handleChange=(e:ChangeEvent<HTMLInputElement>)=>{  //users to get the user
    try{      
     if(e.target.value.length!=0 && data.getclassroom.length>0){
      settext(e.target.value)
      const newusers = data.getclassroom.filter((value:any) => {
        return value.className.toLowerCase().includes(e.target.value.toLowerCase());
      });
      setclassroom(newusers)
     }
     else if(data.getclassroom.length===0){
        setclassroom(data.getclassroom)
     }
     else{
      settext('')
     }
  }
  catch(err){
      throw err
    }
   }

    //to update the classroom
 const [updateClassroom]=useMutation(UPDATE_CLASSROOM_DETAILS,{
   onError(err){
       console.log(err)
   },
  })

  const handleBlock=async(id:string,block:boolean)=>{
     try{
       await updateClassroom({
         variables:{
            id:id,
            update:{
               blockClassroom:!block
            }
         }
       })
       message.info("Blocked the classroom")
     }catch(err){
      throw err
     }
  }

  return (
    <div>
       <div className="mt-5 mx-4 mb-9 flex rounded-lg">
        <input type="text" className='border-2 w-11/12 p-2  px-5 rounded-lg'  placeholder="Search using email" onChange={handleChange} />
        <button className=" bg-blue-700 text-white p-2 px-5 rounded-md  ml-3">Search</button>
    </div>
     {
         (data && classroom.length!=0) ? classroom.map((m:any)=>{
            return (
               <div className='box_shadow w-full my-5 p-3 flex justify-between items-center rounded-md'>
                  <div>
                  <p>Name of the classroom: {m.className}</p>
                <p>Code of the classroom: {m.classCode}</p>
                <p>Person who created classroom: {m.creator}</p>
                  </div>
                  <div>
                  <button className=" bg-green-700 text-white p-2 px-5 rounded-md  ml-3" onClick={()=>handleBlock(m._id,m.blockClassroom)}>{m.blockClassroom? "Blocked" :"Block"}</button>
                  </div>
                
               </div>
            )
        }):
        <p className="mx-auto my-8">No such classroom</p>
     }
      <Pagination defaultCurrent={1} total={(Math.ceil(data && data.getclassroom.length / 6) * 10)} onChange={(e:number) => {
              setpagination(e);
            }}  className='text-center mt-4' />
    </div>
  )
}

export default Classroom