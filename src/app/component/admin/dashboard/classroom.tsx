'use client'
import React, { ChangeEvent,useState } from 'react'
import { GET_CLASSROOMS } from '../../../../apis/classroom'
import { useQuery } from '@apollo/client'
import { Pagination } from 'antd'

function Classroom() {
   
    const {data}=useQuery(GET_CLASSROOMS,{
        onCompleted:(data)=>{
             setclassroom(data.getclassroom)
        }
    })
    const [pagination,setpagination]=useState(1)
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

  return (
    <div>
       <div className="mt-5 mx-4 mb-9 flex rounded-lg">
        <input type="text" className='border-2 w-11/12 p-2  px-5 rounded-lg'  placeholder="Search using email" onChange={handleChange} />
        <button className=" bg-blue-700 text-white p-2 px-5 rounded-md  ml-3">Search</button>
    </div>
     {
         (data && classroom.length!=0) ? classroom.map((m:any)=>{
            return (
               <div className='box_shadow w-full my-5 p-3 rounded-md'>
                <p>Name of the classroom: {m.className}</p>
                <p>Code of the classroom: {m.classCode}</p>
                <p>Person who created classroom: {m.creator}</p>
               </div>
            )
        }):
        <p className="mx-auto my-8">No such user</p>
     }
      <Pagination defaultCurrent={1} total={(Math.ceil(data && data.getclassroom.length / 6) * 10)} onChange={(e:number) => {
              setpagination(e);
            }}  className='text-center mt-4' />
    </div>
  )
}

export default Classroom