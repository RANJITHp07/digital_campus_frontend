import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import React from 'react'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { useRouter } from 'next/navigation';
import {format} from "timeago.js"
import { Dropdown, MenuProps, message} from 'antd';
import { useMutation } from '@apollo/client';
import { DELETE_ASSIGNMENT } from '@/apis/assignment';
import { assignmentClient } from '@/app/providers/ApolloProvider';

function Material({material,assignment,setassignment,id}:{material:any,assignment:any,setassignment:React.Dispatch<any>,id:string}) {
    const router=useRouter()

    const items: MenuProps['items']=[
        {
          key: '1',
          label: (
            <p onClick={handleDelete} ><span className='text text-[#3b6a87] my-2'><DeleteOutlineIcon className='text-lg'/> Delete</span></p> 
          ),
        },
        {
              type: 'divider'
        },
        {
            key: '2',
            label: (
              <p className='text text-[#3b6a87] my-2' onClick={()=>router.push(`/classroom/editAssignment?assignment=${material._id}&classroom=${id}`)}>{(material.assignmentType==='Assignment' ||material.assignmentType==='Material') &&  <><AutoFixNormalIcon className='text-lg'/><span> Edit </span></>}</p> 
            ),
          },
      ]

      const [deleteAssignment]=useMutation(DELETE_ASSIGNMENT,{
        client:assignmentClient,
        variables:{
            id:material._id
        },
        onError(err){
            console.log(err)
        },
        onCompleted:(data)=>{
            const { mainTopic, ...newData } = data.deleteAssignment;

            const a=assignment.map((m:any)=>{
                if(m._id===mainTopic){
                    console.log(m)
                    return {
                        ...m,
                        assignments:m.assignments.filter((m:any)=>m._id!=data.deleteAssignment._id)
                    }
                }
                return m
            })
            setassignment(a)
            message.info("Deleted successfully")
        }
      })

      async function handleDelete(){
         await deleteAssignment()
      }
  return (
    <div>
        <div className='my-4 flex justify-between items-center'>
                <div className='flex items-center'>
                <div className='h-11 w-11 rounded-full flex bg-yellow-900 justify-center items-center'>
                   <ContentPasteIcon className='text-white'/>
                </div>
                {
                  material.assignmentType==="Announcement" ?  
                  <div>
                  <p className='mx-3 text'>Announcment : {material.title}</p>
                  <p className='text-xs text-slate-400 text'> { format(material.createAt) }</p>
                  </div>: 
                  <div>
                  <p className='mx-3 text cursor-pointer' 
                  onClick={()=>router.push(`/classroom/submission?assignment=${material._id}&type=${material.assignmentType}`)}>{material.assignmentType} for this chapter <span className='text-xs text-slate-400'>({material.title})</span></p>
                  <p className='text-xs text-slate-400 text mx-4 '> { format(material.createAt) }</p>
                  </div>
                }
                
                </div>
                
                <Dropdown menu={{ items }} placement="bottomLeft" trigger={['click']}>
                <MoreVertOutlinedIcon className='m-1 text-slate-700 cursor-pointer'/>
                </Dropdown>
                 
            </div>
    </div>
  )
}

export default Material