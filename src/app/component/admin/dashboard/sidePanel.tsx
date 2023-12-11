'use client'
import React from 'react'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { changeAdmintype } from '@/redux/features/classroom-slice/reducer';


function SidePanel() {
  const navigation=useRouter()
  const dispatch=useDispatch<AppDispatch>()
  return (
    <div className='bg-white'>
        <p className="mb-3 text-2xl font-extrabold text-white bg-[#194866] py-3 text-center ">DASHBOARD</p>
        <div className='flex items-center cursor-pointer hover:bg-slate-200 hover:rounded-r-full'>
        <HomeRoundedIcon className="text-3xl my-4  mr-7 text-slate-500"/>
           <p className='text-xl font-semibold text-slate-700' onClick={()=>navigation.push('/admin/dashboard')}>Users</p>
        </div>
        <hr/>
        <div className='flex items-center cursor-pointer hover:bg-slate-200 hover:rounded-r-full'>
        <SummarizeRoundedIcon className="text-3xl my-4 mr-7 text-slate-500"/>
        <p className='text-xl font-semibold text-slate-700' onClick={()=>navigation.push('/admin/dashboard/classroom')}>Classroom</p>
        </div>
        <hr/>
        <div className='flex items-center cursor-pointer hover:bg-slate-200 hover:rounded-r-full'>
        <PaidRoundedIcon className="text-3xl my-4 mr-7 text-slate-500"/>
        <p className='text-xl font-semibold text-slate-700'>Payments</p>
        </div>
        <hr/>
        <div className='flex items-center cursor-pointer hover:bg-slate-200 hover:rounded-r-full'
         onClick={()=>{
          Cookies.remove("accessToken")
          navigation.push('/admin/login')
       }}>
        <LogoutRoundedIcon className="text-3xl my-4 mr-7 text-slate-500"/>
        <p className='text-xl font-semibold text-slate-700'
        >Logout</p>
        </div>
        <hr/>

    </div>
  )
}

export default SidePanel