'use client'
import React,{Suspense,useState,ChangeEvent, useReducer} from 'react';
import Image from 'next/image'
import Navbar from '../component/common/navbar';
import SidePanel from '../component/common/sidePanel';
import Class from '../component/classroom/class';
import {  useAppSelector } from '@/redux/store';
import { useQuery} from '@apollo/react-hooks';
import { FETCH_ADDED_CLASSROOM_QUERY, FETCH_ALL_CLASSROOM_QUERY, FETCH_CLASSROOM_QUERY, GET_FILTRED_CLASSROOM } from '@/apis/classroom';
import LoadinPage from '../component/common/loadinPage';
import Profile from '../component/classroom/profile';
import BasicCalendar from '../component/classroom/calendar';
import { Pagination } from 'antd';
import { ClassroomProps } from '@/interfaces/classroom';




const Classroom=()=>{

  const state = useAppSelector((state) => state.classroomReducer.open);
  const categoryType=useAppSelector((state)=>state.classroomReducer.categoryType)
  const category=useAppSelector((state)=>state.classroomReducer.category)
  const [addedClasroom,setaddedClasroom]=useState(0)
  const [createdClasroom,setcreatedClasroom]=useState(0)
  const [pagination,setpagination]=useState(1)
  const token=useAppSelector((state) => state.authReducer.token);
  const type=useAppSelector((state) => state.classroomReducer.type)


  //to fetch all the classrooms
  const { data:allClassroom} = useQuery(FETCH_ALL_CLASSROOM_QUERY, {
    variables: { id: token.id },
  });

  //to fetch all class added into
  const { data:addedClassroom} = useQuery(FETCH_ADDED_CLASSROOM_QUERY, {
    variables: { id: token.id },
    onCompleted:()=>{
       setaddedClasroom(addedClassroom.getAllClassroom.length)
    }
  });

  //to fetch all the class  created
  const { loading, data } = useQuery(FETCH_CLASSROOM_QUERY, {
    variables: { id: token.id },
    onCompleted:()=>{
      setcreatedClasroom(data.getCreatorClassroom.length)
   }
  });

   //to fetch all the class using filter
   const { data:filteredClassroom } = useQuery(GET_FILTRED_CLASSROOM, {
    variables: { 
      id:token.id,
      category:category
    },
      onError(err){
        console.log(token.id)
        console.log(err)
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
            <BasicCalendar/>
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
                     <Class className={c.className as string} creator={c.creator as string} id={c._id as string} type={!c.students_enrolled || !c.students_enrolled.includes(token.id?.toString() as string)} bg={c.backgroundPicture as string} subject={c.classSubject} section={c.classSection} code={c.classCode} />
                </div>)
                
              )) :
              <div className='flex justify-center w-full'>
                <div>
                { filteredClassroom && <Image src={'/noaddedclassroom.png'} width={500} height={500} alt='classroom'/>} 
               
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
                     <Class className={c.className as string} creator={c.creator as string} id={c._id as string} type={!c.students_enrolled || !c.students_enrolled.includes(token.id?.toString() as string)} bg={c.backgroundPicture as string} subject={c.classSubject} section={c.classSection} code={c.classCode} />
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
                true ? <LoadinPage/> 
                :
                <Suspense fallback={loading}>
              { (data && data.getCreatorClassroom.length > 0) ? (data.getCreatorClassroom.map((c:ClassroomProps) => (
                <div className={` mx-auto md:mx-0 ${state ? 'xl:w-1/3 xm:w-1/2' :'xl:w-1/4 xm:w-1/3'} lg:w-1/3`} key={c._id} >
                     <Class className={c.className as string} creator={c.creator as string} id={c._id as string} type={true} bg={c.backgroundPicture as string} subject={c.classSubject as string} section={c.classSection as string} code={c.classCode} />
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
                    
                     <Class className={c.className} creator={c.creator} id={c._id} code={c.classCode} type={false} bg={c.backgroundPicture} />
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
             type!=="calendar" && <Pagination defaultCurrent={1} total={(Math.ceil(data && data.getCreatorClassroom.length / 9) * 10)} onChange={(e:number) => {
              setpagination(e);
            }}  className='text-center mt-4' />

          }
              </div>
              </div>
    </div>
  );
}


export default Classroom;



