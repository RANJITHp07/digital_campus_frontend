import React from 'react'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Tooltip, message } from 'antd';
import { ADD_REQUEST, ADD_STUDENT, FETCH_REQUEST_DETAILS, REMOVE_REQUEST} from '@/apis/classroom';
import { useMutation, useQuery } from '@apollo/client';
import { useAppSelector } from '@/redux/store';
import PersonIcon from '@mui/icons-material/Person';
import UserDetail from './userDetail';

function Request({id,code}:{id:string,code:string}) {

   const token=useAppSelector((state)=>state.authReducer.token)

  ///to  join into the class
   const [joinStudent]=useMutation(ADD_STUDENT,{
      onError(err){
        console.log(err)
           message.info(err.graphQLErrors[0].message)
      },
      refetchQueries: [{ query:FETCH_REQUEST_DETAILS ,variables:{id:id}}
      ],
      onCompleted: () => {
        message.info("Succesfully added")
      }
   })

   //to fetch request
   const {data}=useQuery(FETCH_REQUEST_DETAILS,{
    onError(err){
      console.log(err)
      message.info("Some error occured")
    },
    variables:{
      id:id
    }
   })

   const [removeRequest]=useMutation(REMOVE_REQUEST,{
    onError(err){
      console.log(err)
      message.info("Some error occured")
    },
    refetchQueries: [{ query:FETCH_REQUEST_DETAILS ,variables:{id:id}}],
    onCompleted: () => {
      message.info("Succesfully removed")
    }
   })

   const handleRemoverequest=(p:any)=>{
     const {__typename,...data}=p
      removeRequest({
        variables:{
          request:{
            ...data,
            code:code
          }
        }
      })
   }


   const handleJoin=async(id:string)=>{
    console.log(code)
       await joinStudent({
        variables:{
          userId:id,
          code:'j4o9'
        }
       })
   }

  return (
    <div className='flex justify-center'>
         <div className='w-3/4 my-9'>
            <div className='mb-9'>
                <div className='flex justify-between items-center'>
                <p className='text-3xl text text-[#3b6a87] mx-4'>Request</p>
                </div>
           <hr className='border-1 rounded-full border-[#3b6a87] mb-6 mt-3'/>
           </div>
           {
            data && data.getClassroomDetails.request.map((s:any)=>{
              return (
                <>
                <div className='flex items-center justify-between text-slate-500'>
              <p className='mx-5 text  '><PersonIcon/> {s.name}</p>
              <div>
              <Tooltip placement="topRight" title={"Remove request"}>
              <PlaylistRemoveIcon className='cursor-pointer' onClick={()=>handleRemoverequest(s)}/>
              </Tooltip>
              <Tooltip placement="topRight" title={"Add to classroom"}>
              <DownloadDoneIcon className='mx-3 cursor-pointer' onClick={()=>handleJoin(s.id)}/>
              </Tooltip>
              {/* <Tooltip placement="topRight" title={"View Profile"}>
              <RemoveRedEyeIcon className='cursor-pointer'/>
              </Tooltip> */}
              </div>
                      </div>
                      <hr className='my-5'/>
                </>
              )
            })

           }
                     
           </div>
    </div>
  )
}

export default Request