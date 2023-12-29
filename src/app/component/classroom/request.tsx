import React from 'react'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Tooltip } from 'antd';

function Request() {
  return (
    <div className='flex justify-center'>
         <div className='w-3/4 my-9'>
            <div className='mb-9'>
                <div className='flex justify-between items-center'>
                <p className='text-3xl text text-[#3b6a87] mx-4'>Request</p>
                </div>
           <hr className='border-1 rounded-full border-[#3b6a87] mb-6 mt-3'/>
           </div>
           <div className='flex items-center justify-between text-slate-500'>
              <p className='mx-5 text  '>Ranjith</p>
              <div>
              <Tooltip placement="topRight" title={"Remove request"}>
              <PlaylistRemoveIcon className='cursor-pointer'/>
              </Tooltip>
              <Tooltip placement="topRight" title={"Add to classroom"}>
              <DownloadDoneIcon className='mx-3 cursor-pointer'/>
              </Tooltip>
              <Tooltip placement="topRight" title={"View Profile"}>
              <RemoveRedEyeIcon className='cursor-pointer'/>
              </Tooltip>
              
              </div>
                      </div>
                      <hr className='my-5'/>
                     
           </div>
    </div>
  )
}

export default Request