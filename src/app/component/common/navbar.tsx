'use client'
import React,{ChangeEvent, Suspense, useReducer, useState} from 'react'
import Image from 'next/image'
import AddIcon from '@mui/icons-material/Add';
import {  Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import { changeModalState } from '@/redux/features/classroom-slice/reducer';
import { Modal } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_REQUEST,CREATE_CLASS,FETCH_ALL_CLASSROOM_NAMES, FETCH_ALL_CLASSROOM_QUERY, FETCH_CLASSROOM_QUERY } from '@/apis/classroom';
import { message } from 'antd';
import { initialState } from '@/reducer/navBar/initalState';
import { reducer } from '@/reducer/navBar/reducer';
import SearchIcon from '@mui/icons-material/Search';
import { ClassroomProps } from '@/@types/classroom';
import { useNavDispatch } from '@/hook/useNavDispatch';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import dynamic from 'next/dynamic';

// Lazy-loaded components
const SidePanel = dynamic(() => import('./sidePanel'));


function Navbar() {

  const {navigation,appSelector,dispatch:dispatched}=useNavDispatch()
  const token=appSelector((state)=>state.authReducer.token)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [initalstate, dispatch] = useReducer(reducer, initialState);
  const {name,subject,section,code,category,state,text,filter,open,open1,open2}=initalstate
  const items: MenuProps['items'] = [  // items of the dropdown
    {
      key: '1',
      label: (
        <p onClick={()=>dispatch({type:"SET_OPEN1",value:true})}>
          Add class
        </p>
      ),
    },
    {
      key: '2',
      label: (
        <p onClick={()=>dispatch({type:"SET_OPEN2",value:true})}>
          Join class
        </p>
      ),
    }
  ];


  //to get all the classroom names 
  const {data}=useQuery(FETCH_ALL_CLASSROOM_NAMES,{
    variables:{
      id:token.id
    },
    onCompleted:(data)=>{
      dispatch({type:'SET_FILTER',value:data.getAllTheClassroom})
    }
  })

  

  //to add the students reuest

  const [addRequest]=useMutation(ADD_REQUEST,{
      variables:{
        request:{
          id:token.id,
        name:token.name,
        code:code
        }
      },
      onError(err){
        console.log(err)
        message.info(err.graphQLErrors[0].message)
      },
      onCompleted:()=>{
        dispatch({type:"SET_OPEN2",value:false})
        message.info("Invitation send to the admin")
      }
  })


  // to create class
  const [createClass]=useMutation(CREATE_CLASS,{
    onError(err) {
      console.log(err)
      message.info("Some error occured")
    },
    refetchQueries: [{ query: FETCH_CLASSROOM_QUERY ,variables:{id:token.id}},
      { query: FETCH_ALL_CLASSROOM_QUERY ,variables:{id:token.id}}
    ],
    onCompleted: () => {
      dispatch({type:"SET_OPEN1",value:false})
      message.info("Succesfully created")
    }
  })

  //fuction to create class
  const Onsubmit=async (e:React.FormEvent<HTMLFormElement>)=>{
      try{
          e.preventDefault()
          if( name && name.length>20){
            message.info("only 20 character allowed")
            return 
          }
          if(name && subject && section){
            if(token.name && token.id){
              const arr=['/bg2.png','/bg3.png','/bg4.png','/bg5.png']
              const randomIndex = Math.floor(Math.random() * arr.length);
              await createClass({
                variables:{
                  className:name as string,
                  classSection:section as string,
                  classSubject:subject as string,
                  creator: token.name,
                  admins: [token.id],
                  category:category as string,
                  backgroundPicture: arr[randomIndex]
              }
              });
            }
          }else{
            message.info("fill all the fields")
          }
      }catch(err){
        message.info("Some error occurred")
      }
  }

  //function to join the class
  const handleJoin=async()=>{
    try{
       if(code){
          await addRequest()
       }else{
        message.info("Enter the code")
       }
    }catch(err){
      throw err
    }
  }


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.value.length !== 0 && filter.length > 0) {
        dispatch({ type: 'SET_STATE', value: true });
        dispatch({ type: 'SET_TEXT', value: e.target.value });
        const newFilter = data.getAllTheClassroom.filter((value: ClassroomProps) => {
          return value.className?.toLowerCase().includes(e.target.value.toLowerCase());
        });
        dispatch({ type: 'SET_FILTER', value: newFilter });

        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        const newTimeoutId = setTimeout(() => {
          dispatch({ type: 'SET_STATE', value: false });
        }, 1000);
        
        setTimeoutId(newTimeoutId);
      } else if (filter.length === 0) {
        dispatch({ type: 'SET_STATE', value: true });
        dispatch({ type: 'SET_FILTER', value: data.getAllTheClassroom });
      } else {
        dispatch({ type: 'SET_STATE', value: false });
        dispatch({ type: 'SET_TEXT', value: '' });
      }
    } catch (err) {
      throw err;
    }
  };
  

  return (
    <nav className="flex justify-between items-center w-full bg-white">
      <div className='p-3 flex items-center'>
      <div className='hidden xm:block'>
        <MenuIcon className='mt-2 mr-3 text-[#3b6a87] cursor-pointer' onClick={()=>dispatched(changeModalState())}/>
        </div>
        <div className='xm:hidden'>
        <MenuIcon className='mt-2 mr-3 text-[#3b6a87] cursor-pointer  lg:hidden' onClick={()=>dispatch({type:"SET_OPEN",value:!open})}/>
        </div>
        <Link href={'/classroom'}>
        <Image
            src={"/Logo.png"}
            width="40"
            height="60"
            alt="logo"
            className='mx-3'
          />
        </Link>
      </div> 
      
      <div className='flex   mx-3 '>
        <div className=' hidden md:flex items-center rounded-full mx-3 border-2 border-slate-300 px-3 py-1'>
          <SearchIcon className=' text-[#8da3b1]'/>
        <input type='text' placeholder='Search for your classes' onChange={handleChange} className='text-[#8da3b1] border-slate-300 focus:outline-none  text  w-96 '/>
        </div>
                <div className='flex items-center mx-3'>
        <Dropdown menu={{ items }} placement="bottomLeft">
        <AddIcon className='mx-3 cursor-pointer text-slate-500'/>
        </Dropdown>
        <NotificationsActiveIcon className='cursor-pointer text-slate-500'/>
        </div>
        {
          state && 
          <div className='absolute top-16 mx-5 w-[26rem] bg-white box_shadow p-2 rounded-lg z-50'>
           {
             filter.length >0 ?filter.map((m:ClassroomProps)=>{
               return(
                <div key={m._id}>
                <p className='text-slate-500 text my-3  cursor-pointer' onClick={()=>navigation.push(`/classroom/${m._id}`)}>{m.className}</p>
                <hr/>
                </div>
               )
             }):<p className='text-slate-300 text cursor-pointer'>No such classroom</p>
           }
        </div>
        }
        
      </div>
      {
        open && 
        <div
            className="fixed top-[4.4rem] left-0 right-0 bottom-0 flex  bg-black bg-opacity-50 z-50"
          >
             <hr/>
            <SidePanel/>
          </div>
      }
      <Suspense fallback={<div>Loading...</div>}>
      <Modal title={<span className='text font-normal text-[#3b6a87]'>Create Class</span>} open={open1} footer={null} onCancel={()=>dispatch({type:"SET_OPEN1",value:false})} >
         <form className="mt-5" onSubmit={Onsubmit}>
          <input type="text" className=" w-full p-2 rounded-md focus:outline-none border-slate-300 border-2 my-2 text text-slate-500" placeholder='Class name(max 20 character)' value={name ? name : ''} onChange={(e:ChangeEvent<HTMLInputElement>)=>dispatch({ type: 'SET_FIELD', field: 'name', value: e.target.value })}/>
          <input type="text" className=" w-full p-2 rounded-md focus:outline-none border-slate-300   border-2 my-2 text text-slate-500" placeholder='Class section' value={section ? section : ''} onChange={(e:ChangeEvent<HTMLInputElement>)=>dispatch({ type: 'SET_FIELD', field: 'section', value: e.target.value })}/>
          <select className=" w-full  p-2 rounded-md focus:outline-none border-slate-300 text-slate-500   border-2 my-2 text "  onChange={(e: ChangeEvent<HTMLSelectElement>) => dispatch({ type: 'SET_FIELD', field: 'category', value: e.target.value })}>
            <option>Junior level</option>
            <option>Higher secondary</option>
            <option>University</option>
          </select>
          <input type="text" className=" w-full p-2 rounded-md focus:outline-none  border-slate-300 text-slate-500   border-2 my-2 text" value={subject? subject : ''} placeholder='Class subject' onChange={(e:ChangeEvent<HTMLInputElement>)=>dispatch({ type: 'SET_FIELD', field: 'subject', value: e.target.value })}/>
          <div className="flex justify-end my-2">
              <button type='submit' className="p-2 border-2 bg-[#3b6a87] text-white rounded-md px-4 text ">Create</button>
          </div>

         </form>
      </Modal>
      <Modal title={<span className='text font-normal text-[#3b6a87]'>Join classroom</span>} open={open2} footer={null} onCancel={()=>dispatch({type:"SET_OPEN2",value:false})}>
      <input type="text" className=" w-full p-2 rounded-md focus:outline-none border-slate-300 border-2 my-2 text" placeholder='Class code' onChange={(e:ChangeEvent<HTMLInputElement>)=>dispatch({ type: 'SET_FIELD', field: 'code', value: e.target.value })}/>
      <div className="flex justify-end my-2">
              <button type='submit' className="bg-[#3b6a87] p-2 border-2 text-white rounded-md px-4 text " onClick={()=>handleJoin()}>Join</button>
          </div>
      </Modal>
      </Suspense>
    </nav>
  )
}

export default Navbar