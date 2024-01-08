import React from 'react'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ReportIcon from '@mui/icons-material/Report';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';




function SidePanel() {
  const navigation=useRouter()
  return (
    <div className='bg-white'>
        <p className="mb-3 text-2xl  text-white bg-[#3b6a87] py-3 text-center ">DASHBOARD</p>
        <div className='flex items-center cursor-pointer hover:bg-slate-200 hover:rounded-r-full'>
        <HomeRoundedIcon className=" my-4  mr-7 text-[#3b6a87]"/>
           <p className='text-xl  text-[#3b6a87]' onClick={()=>navigation.push('/admin/dashboard')}>Users</p>
        </div>
        <hr/>
        <div className='flex items-center cursor-pointer hover:bg-slate-200 hover:rounded-r-full'>
        <SummarizeRoundedIcon className=" my-4 mr-7 text-[#3b6a87]"/>
        <p className='text-xl  text-[#3b6a87]' onClick={()=>navigation.push('/admin/dashboard/classroom')}>Classroom</p>
        </div>
        <hr/>
        <div className='flex items-center cursor-pointer hover:bg-slate-200 hover:rounded-r-full'>
        <ReportIcon className=" my-4 mr-7 text-[#3b6a87]"/>
        <p className='text-xl  text-[#3b6a87]' onClick={()=>navigation.push('/admin/dashboard/reported')}>Reported</p>
        </div>
        <hr/>
        {/* <div className='flex items-center cursor-pointer hover:bg-slate-200 hover:rounded-r-full'>
        <PaidRoundedIcon className=" my-4 mr-7 text-[#3b6a87]"/>
        <p className='text-xl  text-[#3b6a87]'>Payments</p>
        </div>
        <hr/> */}
        <div className='flex items-center cursor-pointer hover:bg-slate-200 hover:rounded-r-full'
         onClick={()=>{
          Cookies.remove("accessToken")
          navigation.push('/admin/login')
       }}>
        <LogoutRoundedIcon className=" my-4 mr-7 text-[#3b6a87]"/>
        <p className='text-xl  text-[#3b6a87]'
        >Logout</p>
        </div>
        <hr/>

    </div>
  )
}

export default SidePanel