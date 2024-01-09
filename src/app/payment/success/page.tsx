import Navbar from '@/app/component/common/navbar'
import Link from 'next/link'
import React from 'react'

function Success() {
  return (
    <div>
        <Navbar/>
        <div  className="w-full h-[30rem] bg-cover "
        style={{
            backgroundImage: `url(${'/payment.png'})`,
          }}>
        </div>
        <div className='flex justify-center w-full'>
            <Link href={'/classroom'} className='text text-white bg-[#1462c1] my-5 p-2 text rounded-full px-5 '>Go to the classroom</Link>
        </div>
    </div>
  )
}

export default Success