'use client'
import { getUser } from '@/apis/user'
import Image from 'next/image'
import React,{useEffect, useState} from 'react'

function UserDetail(email:string) {
    const [user,setUser]=useState([])
    
    useEffect(()=>{
        const fetchData=async()=>{
            const res=await getUser(email)
            setUser(res.data.data)
        };
        fetchData()
    })


  return (
    <div className='flex'>
      <Image src={'profile-logo.jpg'} height={120} width={120} alt='profile'/>
      <div>
        <p>Name: Ranjith P</p>
        <p>Email : ranjith@gmail.com</p>
      </div>
    </div>
  )
}

export default UserDetail