'use client'
import { UsersProps } from '@/@types/users'
import { getUser } from '@/apis/user/user'
import { CircularProgress } from '@mui/material'
import Image from 'next/image'
import React,{useEffect, useState} from 'react'

interface UserDetailProps{
  email:string
}

function UserDetail({email}:UserDetailProps) {
    const [user,setUser]=useState<UsersProps>({})
    const [loading,setLoading]=useState(true)
    
    useEffect(()=>{
        const fetchData=async()=>{
           setLoading(true)
            const res=await getUser(email)
            setUser(res.data.data)
            setLoading(false)
        };
        fetchData()
        
    },[email])


  return (
    <div className='flex w-full'>
      {
          loading ?
          <div className='flex justify-center w-full my-8'>
          <CircularProgress />
          </div>
          :
          ( user && 
         <div className='flex '>
         <Image src={!user.profile ?'/profile-logo.jpg' : user.profile} height={120} width={120} alt='profile'/>
      <div className='mx-7'>
        <p>Name: { user.firstName && user.lastName && (user.firstName[0].toUpperCase() + user.firstName.slice(1,user.firstName.length).toLowerCase() +' '+ user.lastName[0].toUpperCase() + user.lastName.slice(1,user.lastName.length).toLowerCase())}</p>
        <p>Username :{user.username}</p>
        <p>Email : {user.email}</p>
      </div>
      </div>
          )
          
      }
      
    </div>
  )
}

export default UserDetail