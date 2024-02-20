import React from 'react'
import SidePanel from '../../../component/admin/dashboard/sidePanel'
import Navbar from '../../../component/admin/dashboard/navbar'
import SearchClassroom from '../../../component/admin/dashboard/searchClassroom'



async function Dashboard() {

  return (
    <div>
        <div className='bg-white'>
            <Navbar/>
        </div>
        <hr/>
        <div className='flex '>
            <div className='w-60 border-r-2 bg-white hidden lg:block  h-screen'>
                <SidePanel/>
            </div>
            <div className=' w-full  mx-auto'>
               <SearchClassroom/>
            </div>
        </div>
    </div>
  )
}


export default Dashboard