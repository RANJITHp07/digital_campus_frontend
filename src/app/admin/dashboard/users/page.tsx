'use client'
import React from 'react'
import Search from '../../../component/admin/dashboard/search'
import SidePanel from '../../../component/admin/dashboard/sidePanel'
import Navbar from '../../../component/admin/dashboard/navbar'
import { useAppSelector } from '@/redux/store'



async function Users() {
   const adminType = useAppSelector((state)=>state.classroomReducer.adminType)

  return (
    <div>
        <div className='bg-white'>
            <Navbar/>
        </div>
        <hr/>
        <div className='flex '>
            <div className='w-60 border-r-2 bg-white hidden lg:block  min-h-screen'>
                <SidePanel/>
            </div>
            <div className='w-full  mx-auto'>
               {
                adminType==='users' && <Search/>
               }
               
            </div>
        </div>
    </div>
  )
}


export default Users