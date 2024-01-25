import React from 'react'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';




function SidePanel() {
  const navigation=useRouter()
  return (
    <div className='bg-white mx-2 py-3'>
      <div className='flex items-center cursor-pointer hover:bg-slate-200 '>
        <HomeRoundedIcon className=" my-3 mr-7 text-[#3b6a87]"/>
           <p className='text-lg text-[#3b6a87]' onClick={()=>navigation.push('/admin/dashboard')}>Home</p>
        </div>
        <hr className='my-2'/>
        <div className='flex items-center cursor-pointer hover:bg-slate-200 '>
        <PeopleAltIcon className=" my-3 mr-7 text-[#3b6a87]"/>
           <p className='text-lg text-[#3b6a87]' onClick={()=>navigation.push('/admin/dashboard')}>Users</p>
        </div>
        <hr className='my-2'/>
        <div className='flex items-center cursor-pointer hover:bg-slate-200 '>
        <CastForEducationIcon  className=" my-3 mr-7 text-[#3b6a87]"/>
        <p className='text-lg  text-[#3b6a87]' onClick={()=>navigation.push('/admin/dashboard/classroom')}>Classroom</p>
        </div>
        <hr className='my-2'/>
        <div className='flex items-center cursor-pointer hover:bg-slate-200 '>
        <SummarizeRoundedIcon className=" my-3 mr-7 text-[#3b6a87]"/>
        <p className='text-lg  text-[#3b6a87]' onClick={()=>navigation.push('/admin/dashboard/classroom')}>ReportHub</p>
        </div>
        <hr className='my-2'/>
        <div className='flex items-center cursor-pointer hover:bg-slate-200 '>
        <PaidRoundedIcon className=" my-3 mr-7 text-[#3b6a87]"/>
        <p className='text-lg  text-[#3b6a87]'>Payments</p>
        </div>
        <hr className='my-2'/>
        <div className='flex items-center cursor-pointer hover:bg-slate-200 '
         onClick={()=>{
          Cookies.remove("accessToken")
          navigation.push('/admin/login')
       }}>
        <LogoutRoundedIcon className=" my-3 mr-7 text-[#3b6a87]"/>
        <p className='text-lg  text-[#3b6a87]'
        >Logout</p>
        </div>
        <hr className='my-2'/>

    </div>
  )
}

export default SidePanel