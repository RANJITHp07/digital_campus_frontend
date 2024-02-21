'use client'
import { Classroom } from '@/@types/classroom';
import { UPDATE_CLASSROOM_DETAILS } from '@/apis/classroom/mutation';
import { useMutation } from '@apollo/client';
import { Typography } from '@material-tailwind/react';
import { message } from 'antd';
import React, { useState } from 'react'

const classes = "p-4 border-b border-blue-gray-50";

function AllClassroom({props,index}: {props:Classroom ,index:number}) {

   const [blocked,setBlocked]=useState(props.blockClassroom)

      //to update the classroom
 const [updateClassroom]=useMutation(UPDATE_CLASSROOM_DETAILS)

  const handleBlock=async()=>{
     try{
       await updateClassroom({
         variables:{
            id:props._id,
            update:{
               blockClassroom:!blocked
            }
         },
         onCompleted:()=>{
          setBlocked(!blocked)
          message.info(`${!blocked ? 'Blocked' : 'Unblocked'} successfully`);
         }
       })
       
     }catch(err){
      throw err
     }
  }


    return (
        <tr key={props._id}>
          <td className={classes}>
            <Typography variant="small" color="blue-gray" className="text my-3 text-[#3b6a87]">
              {index+1}
            </Typography>
          </td>
          <td className={classes}>
            <Typography variant="small" color="blue-gray" className="text my-3 text-[#3b6a87]">
              {props.className.slice(0,22)}
            </Typography>
          </td>
          <td className={classes}>
            <Typography variant="small" color="blue-gray" className="text my-3 text-[#3b6a87]">
              {props.classCode}
            </Typography>
          </td>
          <td className={classes}>
            <Typography variant="small" color="blue-gray" className="text my-3 text-[#3b6a87]">
            {props.creator}
            </Typography>
          </td>
          <td className={classes}>
            <Typography
              variant="small"
              color="blue-gray"
              className="text my-3 "
              
            >
             <p className={`cursor-pointer ${blocked ? "text-red-800" : "text-green-800"}`} onClick={handleBlock}>{!blocked ? "Block" : "Blocked"}</p>
            </Typography>
          </td>
        </tr>
      );
}

export default AllClassroom