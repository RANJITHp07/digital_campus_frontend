// 'use client'
// import React,{useState,useRef,useEffect} from 'react'
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import {Modal, message,Pagination, Popconfirm} from 'antd'
// import type { MenuProps } from 'antd';
// import { Dropdown } from 'antd';
// import Image from 'next/image'
// import { updateUser } from '@/apis/user/user';
// import { UsersProps } from '@/@types/users';
// import { Socket,io } from 'socket.io-client';
// import { Typography } from '@material-tailwind/react';

// function Users({props, classes}:{props:UsersProps,classes:string}) {

//   const [blocked,setblocked]=useState(props.blocked)
//   const socket=useRef<Socket | null>()
//   const rawDate = new Date(props.created_at as string);
//   const formattedDate = rawDate.toLocaleDateString(); // to convert it into date format

//   const [modal,setmodal]=useState<boolean>(false) // state variable to handle modal
//   const items: MenuProps['items'] = [  // dropdown items
//     {
//       key: '1',
//       label: (
//         <p onClick={handleBlock}>
//           {blocked ? 'Blocked' : 'Block'}
//         </p>
//       ),
//     },
//     {
//       key: '2',
//       label: (
//         <p onClick={()=>setmodal(true)}>
//           View
//         </p>
//       ),
//     }
//   ];

//    async function handleBlock(){  // to block and unblock the user
//     try{
//       if(props.id){
//         const block=await  updateUser(props.id,!blocked)
//         block.data.success && message.info(`${!blocked ? "Blocked" : "Unblocked"} successfully`)
//         setblocked(!blocked)
//         if(socket.current){
//           socket.current.emit('join-room',props.email);
//           socket.current.emit("isBlocked",{email:props.email})
//         }
//       }
//     }catch(err){
//       throw err
//     }
//   }

//   useEffect(()=>{
//   if(!socket.current){
//       socket.current = io('http://localhost:4000');
//     }
//   },[socket])
  
//   return (
//       {/* <div className='md:hidden float-right'>
//       <Dropdown menu={{ items }} placement="bottomLeft">
//       <MoreVertIcon/>
//       </Dropdown>
//       </div>
//     <div className="mx-4 mt-3 md:mt-0">
//         <p>Name: {props.firstName}</p>
//         <p>Email : {props.email}</p>
//     </div>
//     <div className="hidden md:block">
//     <button className={`p-2 px-5 rounded-md w-24 ${blocked ? 'bg-red-700 text-white' : 'bg-green-700 text-white'}`}>
//   <Popconfirm
//     title={`Are you sure to ${blocked ? 'unblock' : 'block'} this user?`}
//     onConfirm={handleBlock}
//     okText="Yes"
//     cancelText="No"
//     okButtonProps={{ style: { backgroundColor:"#3b6a87" } }}
//   >
//     {blocked ? 'Blocked' : 'Block'}
//   </Popconfirm>
// </button>
//         <button className=" text  border-2 p-1.5 px-5 rounded-md mx-4" onClick={()=>setmodal(true)}>View</button>
//     </div>
//     <Modal title={<span className='text font-normal'>User Detail</span>} open={modal} footer={null}  onCancel={()=>setmodal(false)}>
//       {
//         props.profile ?  <Image src={props.profile} width={120} height={120} alt='profile' className='mx-auto rounded-full'/>
//         :  <Image src={'/profile.jpg'} width={120} height={120} alt='profile' className='mx-auto rounded-full'/>
//       }
//          <p className='text'>
//   FirstName: {props.firstName}
// </p>
// <p className='text'>
// LastName: {props.lastName}
// </p>
// <p className='text'>
// Username: {props.username}
// </p>

// <p className='text'>
// Email: {props.email}
// </p>
// <p className='text'>
// Signed In: {formattedDate}
// </p>
//     </Modal> */}
//     <tr key={props.email}>
//                 <td className={classes}>
//                   <Typography
//                     variant="small"
//                     color="blue-gray"
//                     className="text my-3 text-[#3b6a87]"
//                   >
//                     {props.username}
//                   </Typography>
//                 </td>
//                 <td className={classes}>
//                   <Typography
//                     variant="small"
//                     color="blue-gray"
//                     className="text my-3 text-[#3b6a87]"
//                   >
//                     {props.email}
//                   </Typography>
//                 </td>
//                 <td className={classes}>
//                   <Typography
//                     variant="small"
//                     color="blue-gray"
//                     className="text my-3 text-[#3b6a87]"
//                   >
//                     view
//                   </Typography>
//                 </td>
//                 <td className={classes}>
//                   <Typography
//                     as="a"
//                     href="#"
//                     variant="small"
//                     color="blue-gray"
//                     className="text my-3 text-[#3b6a87]"
//                     >                  
//                     {props.blocked}
//                   </Typography>
//                 </td>
//               </tr>
//   )
// }

// export default Users

'use client';
import React, { useState, useRef, useEffect } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Modal, message, Popconfirm } from 'antd';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import Image from 'next/image';
import { updateUser } from '@/apis/user/user';
import { UsersProps } from '@/@types/users';
import { Socket, io } from 'socket.io-client';
import { Typography } from '@material-tailwind/react';

function Users({ props, classes,index }: { props: UsersProps; classes: string,index:number }) {
  const [blocked, setBlocked] = useState(props.blocked);
  const socket = useRef<Socket | null>();
  const rawDate = new Date(props.created_at as string);
  const formattedDate = rawDate.toLocaleDateString(); // to convert it into date format

  const [modal, setModal] = useState<boolean>(false); // state variable to handle modal
  const items: MenuProps['items'] = [
    // dropdown items
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
        <p onClick={() => setModal(true)}>
          View
        </p>
      ),
    },
  ];

  async function handleBlock() {
    // to block and unblock the user
    try {
      if (props.id) {
        const block = await updateUser(props.id, !blocked);
        block.data.success && message.info(`${!blocked ? 'Blocked' : 'Unblocked'} successfully`);
        setBlocked(!blocked);
        if (socket.current) {
          socket.current.emit('join-room', props.email);
          socket.current.emit('isBlocked', { email: props.email });
        }
      }
    } catch (err) {
      throw err;
    }
  }

  useEffect(() => {
    if (!socket.current) {
      socket.current = io('http://localhost:4000');
    }
  }, [socket]);

  return (
    <tr key={props.email}>
      <td className={classes}>
        <Typography variant="small" color="blue-gray" className="text my-3 text-[#3b6a87]">
          {index}
        </Typography>
      </td>
      <td className={classes}>
        <Typography variant="small" color="blue-gray" className="text my-3 text-[#3b6a87]">
          {props.username}
        </Typography>
      </td>
      <td className={classes}>
        <Typography variant="small" color="blue-gray" className="text my-3 text-[#3b6a87]">
          {props.email}
        </Typography>
      </td>
      <td className={classes}>
        <Typography variant="small" color="blue-gray" className="text my-3 text-[#3b6a87]">
        <Modal title={<span className='text font-normal'>User Detail</span>} open={modal} footer={null}  onCancel={()=>setModal(false)}>
     {
        props.profile ?  <Image src={props.profile} width={120} height={120} alt='profile' className='mx-auto rounded-full'/>
        :  <Image src={'/profile.jpg'} width={120} height={120} alt='profile' className='mx-auto rounded-full'/>
      }
         <p className='text'>
  FirstName: {props.firstName}
</p>
<p className='text'>
LastName: {props.lastName}
</p>
<p className='text'>
Username: {props.username}
</p>

<p className='text'>
Email: {props.email}
</p>
<p className='text'>
Signed In: {formattedDate}
</p>
    </Modal>
         <p className='cursor-pointer'  onClick={()=>setModal(true)}>View</p>
        </Typography>
      </td>
      <td className={classes}>
        <Typography
          variant="small"
          color="blue-gray"
          className="text my-3 "
          
        >
         <p className={`cursor-pointer ${blocked ? "text-red-800" : "text-green-800"}`} onClick={handleBlock}> {blocked ? 'Blocked' : 'Block'}</p>
        </Typography>
      </td>
    </tr>
  );
}

export default Users;
