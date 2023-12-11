'use client'
import React,{useState} from 'react'
import Image from 'next/image'
import MenuIcon from '@mui/icons-material/Menu';
import SidePanel from './sidePanel';

function Navbar() {
  const [open,setopen]=useState(false)
  return (
    <nav className="flex justify-between items-center bg-white w-full">
      <div>
      <Image src={"/Logo.png"} width={60} height={60} alt='logo' className='p-2 mx-3' />
      </div>
      <div className='lg:hidden'>
        <MenuIcon className='mx-3' onClick={()=>setopen(!open)}/>
      </div>
      {
        open && 
        <div
            className="fixed top-[4.3rem] left-0 right-0 bottom-0 flex  bg-black bg-opacity-50 z-50 lg:hidden "
          >
             <div className='w-60 border-r-2 bg-white  h-screen'>
                <SidePanel/>
            </div>
            
          </div>
      }
    </nav>
  )
}

export default Navbar