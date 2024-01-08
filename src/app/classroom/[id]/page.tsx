'use client'
import Navbar from '@/app/component/common/navbar'
import SidePanel from '@/app/component/common/sidePanel'
import React,{useEffect,useRef,useState} from 'react'
import Assignment from '@/app/component/classroom/assignments';
import SubNav from '@/app/component/classroom/subNav';
import { useAppSelector } from '@/redux/store';
import People from '@/app/component/classroom/people';
import Classwork from '@/app/component/classroom/classwork';
import {  useSearchParams } from 'next/navigation';
import Chat from '@/app/component/classroom/chat';
import { io, Socket } from 'socket.io-client';
import Request from '@/app/component/classroom/request';
import Submission from '@/app/component/classroom/submission';



function Classroom({ params }: { params: { id: string } }) {

 const assign=useAppSelector(state=>state.classroomReducer.assignment)
 const chatOpen=useAppSelector(state=>state.classroomReducer.chatOpen)
 const token=useAppSelector(state=>state.authReducer.token)
 const searchParams = useSearchParams()
 const socket=useRef<Socket | null>()
 const code= searchParams.get('code') as string
 const [id,setid]=useState('')
 const [length,setlength]=useState(0)



 useEffect(() => {
    if(!socket.current){
        socket.current = io('wss://www.digitalcampus.shop',{
            path:"/socket-chat/"
        });
        socket.current.emit('join-room', params.id);
    }
    
  }, [socket]);

  return (
    <div>
        <div className={chatOpen ? "blur-sm overflow-hidden" : ""}>
        <Navbar/>
        <hr/>
        
        <div className="flex">
            <div className="min-h-screen border-r-2 hidden lg:block">
                <SidePanel/>
            </div>
            <div className="w-full">
                <SubNav id={params.id}/>
                {
                 assign==='stream' && <Assignment id={params.id}/>
                }
                {
                 assign==='classwork' && <Classwork id={params.id}/>
                }
                {
                 assign==='people' && <People id={params.id} code={code}/>
                }
                {
                 assign==='request' && <Request id={params.id} code={code}/>
                }
                {
                 assign==='submission' && <Submission id={params.id}/>
                }
                {/* {
                 assign==='stream' && <Assignment id={params.id}/>
                } */}
            </div>
        </div>
        </div>
        {
            chatOpen&&
            <div className=' fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-10/12 h-3/4 z-50 bg-white box_shadow'>
    {
        socket .current  && <Chat socket={socket.current} classId={params.id} />
    }
    
</div>
        }
    </div>
  )
}

export default Classroom