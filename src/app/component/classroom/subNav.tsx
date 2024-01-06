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
import { useNavDispatch } from '@/hook/useNavDispatch';

function SubNav({id}:{id:string}) {

    const {navigation,dispatch,appSelector}=useNavDispatch()
    const [border,setBorder]=useState('stream')
    const creator=appSelector((state)=>state.classroomReducer.creator)

    //to handle the section click
    const handleSectionClick=(type:string)=>{
      setBorder(type)
      dispatch(changeAssignment(type))
    }

    const items: MenuProps['items'] = [
        {
          label: <p className='text text-[#3b6a87]' onClick={()=>handleSectionClick('stream')}>Stream</p>,
          key: '0',
        },
        {
            label: <p className='text text-[#3b6a87]' onClick={()=>handleSectionClick('classwork')}>Classwork</p>,
            key: '1',
        },
          {
            label: <p className='text text-[#3b6a87]' onClick={()=>handleSectionClick('people')}>People</p>,
            key: '2',
          },
          {
            label: <p className='text text-[#3b6a87]' onClick={()=>handleSectionClick('grades')}>Grades</p>,
            key: '3',
          },
          {
            label: <p className='text text-[#3b6a87]' onClick={()=>handleSectionClick('request')}>Request</p>,
            key: '4',
          },
          {
            label: <p className='text text-[#3b6a87]' onClick={()=>handleSectionClick('submission')}>Submission</p>,
            key: '5',
          }
       
      ];
  return (
    <div>
        <div className='w-full'>
                    <nav className='md:flex justify-between items-center hidden '>
                        <div className='flex'>
                        <p className= {`pb-3 mx-5 pt-3 text text-lg text-[#3b6a87] ${border==='stream' && ' border-b-4 border-[#3b6a87]'}  cursor-pointer `} onClick={()=>
                          handleSectionClick('stream')
                          }>Stream</p>
                     <p className={`mx-5 pb-3 pt-3 text text-lg text-[#3b6a87] ${border==='classwork' && ' border-b-4 border-[#3b6a87]'}  cursor-pointer `} onClick={()=>
                      handleSectionClick('classwork')
                      }>Classwork</p>
                     <p className={`mx-5 pb-3 pt-3 text text-lg text-[#3b6a87] cursor-pointer ${border==='people' && ' border-b-4 border-[#3b6a87]'} ` }
                     onClick={()=>
                     handleSectionClick('people')
                     }>People</p>
                     {/* <p className={` ${border==='grades' && ' border-b-4 border-[#3b6a87]'} pb-3 mx-5 pt-3 text text-lg text-[#3b6a87] cursor-pointer`} onClick={()=>
                      handleSectionClick('grades')
                      }>{creator && "Grades" }</p> */}
                      <p className={` ${border==='request' && ' border-b-4 border-[#3b6a87]'} pb-3 mx-5 pt-3 text text-lg text-[#3b6a87] cursor-pointer`} onClick={()=>
                       handleSectionClick('request')
                      }>{creator && "Request" }</p>
                       <p className={` ${border==='submission' && ' border-b-4 border-[#3b6a87]'} pb-3 mx-5 pt-3 text text-lg text-[#3b6a87] cursor-pointer`} onClick={()=>
                       handleSectionClick('submission')
                      }>{creator && "Submission" }</p>
                        </div>
                        <div className='mx-5 items-center flex'>
                         <VideocamOutlinedIcon className='text-[#3b6a87] cursor-pointer text-3xl mx-3' onClick={()=>navigation.push(`/classroom/vediocall/${id}`)}/>
                          <Tooltip placement="topLeft" title={"Chat"}>
                        <ForumIcon className='text-[#3b6a87] cursor-pointer' onClick={()=>dispatch(changeChatState(true))}/>
                        </Tooltip>
                        <CalendarMonthIcon className='text-[#3b6a87] cursor-pointer mx-3'/>
                        </div>
                    </nav>
                    <nav className='md:hidden justify-between items-center  py-3 flex'>
                        <div>
                        <Dropdown menu={{ items }} trigger={['click']}>
                            <p className='text text-[#3b6a87] mx-3 '>Dashboard<ArrowDropDownIcon/></p>
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