'use client'
import React,{Suspense,useState,useEffect,useRef} from 'react';
import Image from 'next/image'
import Navbar from '../component/common/navbar';
import Class from '../component/classroom/class';
import {  useAppSelector } from '@/redux/store';
import { useQuery} from '@apollo/react-hooks';
import { FETCH_ADDED_CLASSROOM_QUERY, FETCH_ALL_CLASSROOM_QUERY, FETCH_CLASSROOM_QUERY, GET_FILTRED_CLASSROOM } from '@/apis/classroom';
import LoadinPage from '../component/common/loadinPage';
import Profile from '../component/classroom/profile';
import { Pagination, Popover } from 'antd';
import { ClassroomProps } from '@/@types/classroom';
import { DUE_DATES } from '@/apis/assignment';
import { assignmentClient } from '../providers/ApolloProvider';
import moment from "moment";
import { Event } from '@/@types/assignment';
import Cookies from 'js-cookie';
import { Socket,io} from 'socket.io-client';
import dynamic from 'next/dynamic';

//dynamic imports
const SidePanel = dynamic(()=>import('../component/common/sidePanel'))
const BasicCalendar = dynamic(()=>import('../component/classroom/calendar'))




const Classroom=()=>{

  //redux state
  const state = useAppSelector((state) => state.classroomReducer.open);
  const categoryType=useAppSelector((state)=>state.classroomReducer.categoryType)
  const category=useAppSelector((state)=>state.classroomReducer.category)
  const token=useAppSelector((state) => state.authReducer.token);
  const type=useAppSelector((state) => state.classroomReducer.type)

  //states
  const [addedClasroom,setAddedClasroom]=useState(0)
  const [createdClasroom,setCreatedClasroom]=useState(0)
  const [pagination,setPagination]=useState(1)
  const [event,setEvent]=useState<Event[]>([])
  const socket=useRef<Socket | null>(null)


  useEffect(()=>{

    if(!socket.current){
      socket.current = io('wss://www.digitalcampus.shop',{
              path:"/socket-auth/"
            });
      socket.current.on("responseIsBlocked",(data:{isBlocked:boolean})=>{
        if(data.isBlocked){
          Cookies.remove('accessToken')
          window.location.href = '/login'
        }  
        
      })
    }
  },[socket])

  //to fetch all the classrooms
  const { data:allClassroom} = useQuery(FETCH_ALL_CLASSROOM_QUERY, {
    variables: { id: token.id },
});

  //to fetch all class added into
  const { data:addedClassroom} = useQuery(FETCH_ADDED_CLASSROOM_QUERY, {
    variables: { id: token.id },
    onCompleted:()=>{
       setAddedClasroom(addedClassroom.getAllClassroom.length)
    }
  });

  //to fetch all the class  created
  const { loading, data } = useQuery(FETCH_CLASSROOM_QUERY, {
    variables: { id: token.id },
    onError(err){
     console.log(err)
    },
    onCompleted:()=>{
      setCreatedClasroom(data.getCreatorClassroom.length)
   }
  });

   //to fetch all the class using filter
   const { data:filteredClassroom } = useQuery(GET_FILTRED_CLASSROOM, {
    variables: { 
      id:token.id,
      category:category
    },
      onError(err){
        console.log(err)
      },
  });


  //to fetch all the due dates
  const { data:due_dates } = useQuery(DUE_DATES, {
    client:assignmentClient,
    variables: { 
      id:token.id,
    },
      onCompleted:(data)=>{
        let result: { [key: string]: { name: string } } = {};
        allClassroom.getAllTheClassroom.forEach((m: any) => {
        result[m._id] = { name: m.className };
      });
      
       const e:Event[]=data.getDueDates.map((d:Event)=>{
          return {
            start: moment(`${d.dueDate.day}T00:00:00`).toDate(),
            end: moment(`${d.dueDate.day}T${d.dueDate.time}`).toDate(),
            title: 
            <Popover placement="right" content={
              <div>
                <p>Classroom: {result[d.class_id[0]].name}</p>
                <p>Created By {d.creator[0].toUpperCase() + d.creator.slice(1,d.creator.length)}</p>
              </div>
            } title={<p>{d.title.toUpperCase()}</p>} trigger="hover">
              <p>{d.title}</p>
            </Popover>
          }
        })
        setEvent(e)
      }
  });

  return (
    <div>
          <Navbar />
          <hr className='bg-black border-3' />
          <div className='xm:flex'>
            <div className='border-r-2 z-50 hidden xm:block  min-h-screen '>
              <SidePanel />
            </div>
            { 
              type==='calendar' && 
             <div className="w-full text-[#3b6a87]">
            <BasicCalendar events={event}/>
            </div> 
            }
            <div className={`${type!=='calendar' && 'w-full'}`}>
            {
              type==="home" && !categoryType && 
              
              <div className={` flex-wrap flex lg:ml-7 xl:ml-12 md:ml-12 ${!state && 'xm:ml-0'}`}>
              {
                loading ? <LoadinPage/> 
                :
                <Suspense fallback={loading}>
              { (filteredClassroom && filteredClassroom.getFilteredClassroom.length > 0) ? (filteredClassroom.getFilteredClassroom.map((c:ClassroomProps) => (
                <div className={` mx-auto md:mx-0 ${state ? 'xl:w-1/3 xm:w-1/2' :'xl:w-1/4 xm:w-1/3'} lg:w-1/3`} key={c._id} >
                     <Class className={c.className as string} creator={c.creator as string} id={c._id as string} type={!c.students_enrolled || !c.students_enrolled.includes(token.id?.toString() as string)} bg={c.backgroundPicture as string} subject={c.classSubject} section={c.classSection} code={c.classCode} profile={c.profile as string} />
                </div>)
                
              )) :
              <div className='flex justify-center w-full'>
                <div>
                { filteredClassroom && <Image src={'/filter.jpg'} width={500} height={500} alt='classroom'/>} 
               
                </div>
              </div>
            
            }
              </Suspense>
              }
              </div>
            } 
            {
              type==="home" && categoryType && 
              
              <div className={` flex-wrap flex lg:ml-7 xl:ml-12 md:ml-12 ${!state && 'xm:ml-0'}`}>
              {
                loading ? <LoadinPage/> 
                :
                <Suspense fallback={loading}>
              { (allClassroom && allClassroom.getAllTheClassroom.length > 0) ? (allClassroom.getAllTheClassroom.map((c:ClassroomProps) => (
                <div className={` mx-auto md:mx-0 ${state ? 'xl:w-1/3 xm:w-1/2' :'xl:w-1/4 xm:w-1/3'} lg:w-1/3`} key={c._id} >
                     <Class className={c.className as string} creator={c.creator as string} id={c._id as string} type={!c.students_enrolled || !c.students_enrolled.includes(token.id?.toString() as string)} bg={c.backgroundPicture as string} subject={c.classSubject} section={c.classSection} code={c.classCode} profile={c.profile as string} block={c.blockClassroom} />
                </div>)
                
              )) :
              <div className='flex justify-center w-full'>
                <div>
                { allClassroom && <Image src={'/noaddedclassroom.png'} width={500} height={500} alt='classroom'/>} 
               
                </div>
              </div>
            
            }
              </Suspense>
              }
              </div>
            }
            
            {
              type==="teaching" && 
              
              <div className={` flex-wrap flex lg:ml-7 xl:ml-12 md:ml-12 ${!state && 'xm:ml-0'}`}>
              {
                loading ? <LoadinPage/> 
                :
                <Suspense fallback={loading}>
              { (data && data.getCreatorClassroom.length > 0) ? (data.getCreatorClassroom.map((c:ClassroomProps) => (
                <div className={` mx-auto md:mx-0 ${state ? 'xl:w-1/3 xm:w-1/2' :'xl:w-1/4 xm:w-1/3'} lg:w-1/3`} key={c._id} >
                     <Class className={c.className as string} creator={c.creator as string} id={c._id as string} type={true} bg={c.backgroundPicture as string} subject={c.classSubject as string} section={c.classSection as string} code={c.classCode} profile={c.profile as string} />
                </div>)
                
              )) :
              <div className='flex justify-center w-full'>
                <div>
                <Image src={'/noaddedclassroom.png'} width={500} height={500} alt='classroom'/>
               
                </div>
              </div>
            
            }
              </Suspense>
              }
              </div>
            }
            {
              type==="enrolled" && 
              <div className={` flex-wrap flex lg:ml-7 xl:ml-12 md:ml-12 ${!state && 'xm:ml-0'}`}>
              {
                loading ? <LoadinPage/> 
                :
                <Suspense fallback={loading}>
                  
              { (addedClassroom  && addedClassroom.getAllClassroom.length>0 ) ?addedClassroom.getAllClassroom.slice(pagination * 9 - 9, pagination * 9).map((c: any) => (
                <div className={` mx-auto md:mx-0 ${state ? 'xl:w-1/3 xm:w-1/2' :'xl:w-1/4 xm:w-1/3'} lg:w-1/3`} key={c._id} >
                    
                     <Class className={c.className} creator={c.creator} id={c._id} code={c.classCode} type={false} bg={c.backgroundPicture}  profile={c.profile as string}/>
                </div>
              )):
              <div className='flex justify-center w-full'>
              <div>
              <Image src={'/noclassrooms.png'} width={500} height={500} alt='classroom'/>
              
              </div>
            </div>
            }
              </Suspense>
              }
              </div>
            }
            {
              type==="profile" && <div className="w-full justify-center">
              <Profile addedClassroom={addedClasroom} createdClassroom={createdClasroom}/>
             </div>
            }
            {
             type!=="calendar" && ((data && data.getCreatorClassroom.length) || (filteredClassroom && filteredClassroom.getFilteredClassroom.length > 0) || (addedClassroom  && addedClassroom.getAllClassroom.length>0 ))  && <Pagination defaultCurrent={1} total={(Math.ceil(data && data.getCreatorClassroom.length / 9) * 10)} onChange={(e:number) => {
              setPagination(e);
            }}  className='text-center mt-4' />

          }
              </div>
              </div>
    </div>
  );
}


export default Classroom;



