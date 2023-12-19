'use client'
import React,{useState} from 'react'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Dropdown, Tooltip} from 'antd';
import type { MenuProps } from 'antd';
import { AppDispatch, useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { changeAssignment, changeChatState } from '@/redux/features/classroom-slice/reducer';
import ForumIcon from '@mui/icons-material/Forum';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import { useRouter } from 'next/navigation';

function SubNav({id}:{id:string}) {

    const router=useRouter()
    const [border,setborder]=useState('stream')
    const creator=useAppSelector((state)=>state.classroomReducer.creator)
    const dispatch=useDispatch<AppDispatch>()

    const items: MenuProps['items'] = [
        {
          label: <p className='text'>Stream</p>,
          key: '0',
        },
        {
            label: <p className='text'>Classroom</p>,
            key: '1',
        },
          {
            label: <p className='text'>People</p>,
            key: '2',
          },
          {
            label: <p className='text'>Grades</p>,
            key: '3',
          },
       
      ];
  return (
    <div>
        <div className='w-full'>
                    <nav className='md:flex justify-between items-center hidden '>
                        <div className='flex'>
                        <p className= {`pb-3 mx-5 pt-3 text text-lg text-[#3b6a87] ${border==='stream' && ' border-b-4 border-[#3b6a87]'}  cursor-pointer `} onClick={()=>
                          {
                            setborder('stream')
                            dispatch(changeAssignment("stream"))
                          }}>Stream</p>
                     <p className={`mx-5 pb-3 pt-3 text text-lg text-[#3b6a87] ${border==='classwork' && ' border-b-4 border-[#3b6a87]'}  cursor-pointer `} onClick={()=>
                      {
                        setborder('classwork')
                        dispatch(changeAssignment("classwork"))
                      }}>Classwork</p>
                     <p className={`mx-5 pb-3 pt-3 text text-lg text-[#3b6a87] cursor-pointer ${border==='people' && ' border-b-4 border-[#3b6a87]'} ` }
                     onClick={()=>
                     {
                       setborder('people')
                       dispatch(changeAssignment("people"))
                     }}>People</p>
                     <p className={` ${border==='grades' && ' border-b-4 border-[#3b6a87]'} pb-3 mx-5 pt-3 text text-lg text-[#3b6a87] cursor-pointer`} onClick={()=>
                      {
                        setborder('grades')
                        dispatch(changeAssignment("grades"))
                      }
                      }>{creator && "Grades" }</p>
                        </div>
                        <div className='mx-5 items-center flex'>
                          {creator && <VideocamOutlinedIcon className='text-[#3b6a87] cursor-pointer text-3xl mx-3' onClick={()=>router.push(`/classroom/vediocall/${id}`)}/>}
                          <Tooltip placement="topLeft" title={"Chat"}>
                        <ForumIcon className='text-[#3b6a87] cursor-pointer' onClick={()=>dispatch(changeChatState(true))}/>
                        </Tooltip>
                        <CalendarMonthIcon className='text-[#3b6a87] cursor-pointer mx-3'/>
                        </div>
                    </nav>
                    <nav className='md:hidden justify-between items-center  py-3 flex'>
                        <div>
                        <Dropdown menu={{ items }} trigger={['click']}>
                            <p className='text-xl text-[#3b6a87] mx-3 '>Dasboard<ArrowDropDownIcon/></p>
                            </Dropdown>
                        </div>
                    <div className='mx-5'>
                    <ForumIcon className='text-[#3b6a87] cursor-pointer' onClick={()=>dispatch(changeChatState(true))}/>
                        <CalendarMonthIcon className='text-[#3b6a87] cursor-pointer mx-3'/>
                            
                        </div>
                    </nav>
                </div>
                <hr/>
                

                
    </div>
  )
}

export default SubNav