'use client'
import React,{useState} from 'react'

import MoreVertIcon from '@mui/icons-material/MoreVert';
import {Modal, message,Pagination, Popconfirm} from 'antd'
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import Image from 'next/image'
import { updateUser } from '@/apis/user';
import { UsersProps } from '@/interfaces/users';

function Users({props}:{props:UsersProps}) {

  const [blocked,setblocked]=useState(props.blocked)
  const rawDate = new Date(props.created_at);
  const formattedDate = rawDate.toLocaleDateString(); // to convert it into date format

  const [modal,setmodal]=useState<boolean>(false) // state variable to handle modal
  const items: MenuProps['items'] = [  // dropdown items
    {
      key: '1',
      label: (
        <p onClick={handleBlock}>
          {blocked ? 'Blocked' : 'Block'}
        </p>
      ),
    },
    {
      key: '2',
      label: (
        <p onClick={()=>setmodal(true)}>
          View
        </p>
      ),
    }
  ];

   async function handleBlock(){  // to block and unblock the user
    try{
      if(props.id){
        const block=await  updateUser(props.id,!blocked)
        block.data.success && message.info(`${!blocked ? "Blocked" : "Unblocked"} successfully`)
        setblocked(!blocked)
        
      }
    }catch(err){
      throw err
    }
  }
  
  return (
    <div className="box_shadow my-6 mx-4 rounded-md p-3 bg-white md:flex items-center justify-between">
      <div className='md:hidden float-right'>
      <Dropdown menu={{ items }} placement="bottomLeft">
      <MoreVertIcon/>
      </Dropdown>
      </div>
    <div className="mx-4 mt-3 md:mt-0">
        <p>Name: {props.firstName}</p>
        <p>Email : {props.email}</p>
    </div>
    <div className="hidden md:block">
    <button className={`p-2 px-5 rounded-md w-24 ${blocked ? 'bg-red-700 text-white' : 'bg-green-700 text-white'}`}>
  <Popconfirm
    title={`Are you sure to ${blocked ? 'unblock' : 'block'} this user?`}
    onConfirm={handleBlock}
    okText="Yes"
    cancelText="No"
  >
    {blocked ? 'Blocked' : 'Block'}
  </Popconfirm>
</button>
        <button className=" border-slate-400  border-2 p-1.5 px-5 rounded-md mx-4" onClick={()=>setmodal(true)}>View</button>
    </div>
    <Modal title="User Detail" open={modal} footer={null}  onCancel={()=>setmodal(false)}>
      {
        props.profile ?  <Image src={props.profile} width={150} height={150} alt='profile' className='mx-auto rounded-full'/>
        :  <Image src={'/profile.jpg'} width={150} height={150} alt='profile' className='mx-auto rounded-full'/>
      }
         <p className='text-lg' style={{ fontFamily: '"Roboto Slab", serif' }}>
  FirstName: {props.firstName}
</p>
<p className='text-lg' style={{ fontFamily: '"Roboto Slab", serif' }}>
LastName: {props.lastName}
</p>
<p className='text-lg' style={{ fontFamily: '"Roboto Slab", serif' }}>
Username: {props.username}
</p>

<p className='text-lg' style={{ fontFamily: '"Roboto Slab", serif' }}>
Email: {props.email}
</p>
<p className='text-lg' style={{ fontFamily: '"Roboto Slab", serif' }}>
Signed In: {formattedDate}
</p>
    </Modal>
    </div>
  )
}

export default Users