'use client'
import React,{useState,ChangeEvent, useEffect} from 'react'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Users from './users'
import { Pagination } from 'antd';
import { UsersProps } from '@/@types/users';
import { getAllusers, paginationUser } from '@/apis/user';

function Search() {
   const[pagination,setpagination]=useState(1)
   const[text,settext]=useState('')
   const [users,setusers]=useState([])
    // useEffect(()=>{
    //   const fetchData=async ()=>{
    //     const res=await getAllusers()
    //     setusers(res.data.data)
    //     console.log(res.data)
    //   }
    //   fetchData()
    // },[])



  // console.log(users)
   const handleChange=(e:ChangeEvent<HTMLInputElement>)=>{  //users to get the user
    try{      
     if(e.target.value.length!=0 && users.length>0){
      settext(e.target.value)
      const newusers = users.filter((value:UsersProps) => {
        return value.email?.toLowerCase().includes(e.target.value.toLowerCase());
      });
      setusers(newusers)
     }
     else if(users.length===0){
        setusers(users)
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
    <div> 
     { users ? users.slice(pagination * 6 - 6, pagination * 6).map((p:UsersProps)=>{
           return (
             <Users props={p}/>
           )
      }):<p className="text-center text-xl my-5 text-slate-400">No such user</p>
  }
    </div>
     { users  &&<Pagination defaultCurrent={1} total={(Math.ceil(users.length / 6) * 10)} onChange={(e:number) => {
              setpagination(e);
            }}  className='text-center mt-4' />
          }
    </div>
  )
}

export default Search