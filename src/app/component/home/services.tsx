import React from 'react'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LockIcon from '@mui/icons-material/Lock';

function Services() {
  return (
    <div className="xl:mx-32 lg:mx-16 my-6 md:my-16" id='services'>
        <div className="md:flex justify-center">
            <div className="md:w-1/2 xm:w-1/3 mb-12  mx-4 md:mx-9 box_shadow rounded-lg min-h-96  p-2">
                  <div className='w-12 m-5 md:m-3 h-12 rounded-full bg-[#194866] flex justify-center items-center'><DashboardCustomizeIcon className='text-white text-3xl'/></div>
                  <div className='ml-5 mt-16'>
                  <p className='heading text-[#194866] text-3xl'>Customise your learning experience</p>
                  <p className='my-5 text text-[#194866]'>With a wide range of inbuilt features, plugins, and integrations at your disposal, you can create any course or learning environment you envision with Digital Campus.</p>
                  </div>
            </div>
            <div className=" md:w-1/2 xm:w-1/3 mb-12 mx-4 md:mx-9 box_shadow rounded-lg min-h-96  p-2">
            <div className='w-12 m-3 h-12 rounded-full bg-[#194866] flex justify-center items-center'><AcUnitIcon className='text-white text-3xl'/></div>
            <div className='ml-5 mr-3 mt-16'>
                  <p className='heading text-[#194866] text-3xl'>Scale your platform to any size</p>
                  <p className='my-5 text text-[#194866]'>From small classrooms to large universities, global companies, and government departments, Digital Campus can be scaled to support organisations of all sizes.</p>
                  </div>
            </div>
            <div className="md:hidden lg:block xm:w-1/3 mb-12  mx-4 md:mx-9 box_shadow rounded-lg min-h-96 p-2">
            <div className='w-12 m-3 h-12 rounded-full bg-[#194866] flex justify-center items-center'><LockIcon className='text-white text-3xl'/></div>
            <div className='ml-5 mr-3 mt-16'>
                  <p className='heading text-[#194866] text-3xl'>Safeguard your LMS data and systems</p>
                  <p className='my-5 text text-[#194866]'>As an open source platform, Digital Campus is committed to safeguarding data security, user privacy, and security controls. For complete control, Digital Campus can be easily deployed on a private secure cloud or server.</p>
                  </div>
            </div>
            </div>
            <div className=" hidden md:block lg:hidden md:w-1/2 mb-12    box_shadow rounded-lg min-h-96 mx-auto  p-2">
            <div className='w-12 m-3 h-12 rounded-full bg-[#194866] flex justify-center items-center'><LockIcon className='text-white text-3xl'/></div>
            <div className='ml-5 mr-3 mt-16'>
                  <p className='heading text-[#194866] text-3xl'>Safeguard your LMS data and systems</p>
                  <p className='my-5 text text-[#194866]'>As an open source platform, Digital Campus is committed to safeguarding data security, user privacy, and security controls. For complete control, Digital Campus can be easily deployed on a private secure cloud or server.</p>
                  </div>
        </div>
        </div>
  )
}

export default Services