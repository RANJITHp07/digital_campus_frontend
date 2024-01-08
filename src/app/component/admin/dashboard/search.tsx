'use client'
import React,{useState,ChangeEvent, useEffect} from 'react'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Users from './users'
import { Pagination } from 'antd';
import { UsersProps } from '@/@types/users';
import { paginationUser, searchUser} from '@/apis/user/user';

function Search() {
   const[pagination,setpagination]=useState(1)
   const[text,settext]=useState('')
   const [users,setusers]=useState([])
    useEffect(()=>{
      const fetchData=async ()=>{
        const res=await paginationUser(pagination)
        setusers(res.data.data)
      }
      fetchData()
    },[pagination])



  // console.log(users)
   const handleChange=async(e:ChangeEvent<HTMLInputElement>)=>{  //users to get the user
    try{      
     if(e.target.value.length!=0 && users.length>0){
        const res=await searchUser(e.target.value);
        setusers(res.data.data)
        setpagination(1)
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
        <button className="  text-white p-2 px-5 rounded-md  bg-[#3b6a87] ml-3">Search</button>
    </div>
    <div> 
     { users.length>0 ? users.map((p:UsersProps)=>{
           return (
             <Users props={p}/>
           )
      }):<p className="text-center text-xl my-5 text-slate-400">No such user</p>
  }
    </div>
     { users && users.length>0 &&<Pagination defaultCurrent={1} total={100} onChange={(e:number) => {
              setpagination(e);
            }}  className='text-center mt-4' />
          }
    </div>
  )
}

export default Search