'use client'
import React,{ChangeEvent, useRef,useState,useEffect} from 'react'
import CloseIcon from '@mui/icons-material/Close';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import data from '@emoji-mart/data'
import Image from 'next/image'
import { AppDispatch, useAppSelector} from '@/redux/store';
import { useDispatch } from 'react-redux';
import { changeChatState } from '@/redux/features/classroom-slice/reducer';
import Picker from '@emoji-mart/react'
import { Socket } from 'socket.io-client';
import { getMessage } from '@/apis/chat';
import {format} from "timeago.js"
import { Modal } from 'antd';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import VideocamIcon from '@mui/icons-material/Videocam';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Box } from '@mui/material';

const actions = [
  { icon: <FileCopyIcon sx={{ color: '#6d8594'}} />, name: 'Pdf' },
  { icon: <PhotoLibraryIcon  sx={{ color: '#6d8594'}}/>, name: 'Photo' },
  { icon: <AudiotrackIcon  sx={{ color: '#6d8594'}}/>, name: 'Audio' },
  { icon: <VideocamIcon  sx={{ color: '#6d8594'}}/>, name: 'Vedio' },
];


function Chat({length,id,classId,socket}:{length:number,id:string,classId:string,socket:Socket}) {
  const scrollRef = useRef<any>();
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch=useDispatch<AppDispatch>()
  const [message,setmessage]=useState<any[]>([])
  const [newMessage,setNewmessage] =useState('')
  const [type,settype]=useState('text')
  const [typing, setTyping] = useState(false);
  const [emojii,setemojii]=useState(false)
  const [name,setname]=useState('')
  const [typingTimeout, settypingTimeout] = useState<any>(null);
  const token=useAppSelector((state)=>state.authReducer.token)
  const [file,setfile]=useState<File[]>([])

  const addEmoji = (e:any) => {
    const sym = e.unified.split("_");
    const codeArray:any = [];
    sym.forEach((el:any) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);
    setNewmessage((prev)=>prev+emoji)
  };
  

   //to handle the typing
   function handleInput(e: ChangeEvent<HTMLInputElement>) {
    if (socket) {
      setNewmessage(e.target.value);
      socket.emit('typing-started', {classId:classId,name:token.name});

      if (typingTimeout) clearTimeout(typingTimeout);

      settypingTimeout(
        setTimeout(() => {
          socket && socket.emit('typing-stoped', {classId:classId,name:token.name});
        }, 1000)
      );
    }
  }

   //to handle the message
   const handleMessage=()=>{
      const m={
        classId:classId,
        sender:token.id,
        text:{
          type:type,
          text:newMessage
        }
      }
      setmessage([...message,m])
      socket.emit('sendMessage', { classId:classId,message:m});
      scrollRef?.current.scrollIntoView({ behavior: 'smooth' });
      setNewmessage('')
    }
      

   const handleKeyPress = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleMessage();
    }
  };

   useEffect(() => {
    scrollRef?.current.scrollIntoView({ behavior: 'smooth' });
    inputRef.current &&  inputRef.current.focus();
  }, [message]);

  useEffect(()=>{
     socket.on('getMessage',(m)=>{
      console.log(message)
       setmessage( (prev)=>[...prev,m])
     })
  },[socket])

  useEffect(()=>{
     const fetchData=async()=>{
       const res=await  getMessage(classId)
       console.log(res.data.data)
       setmessage(res.data.data)
     }
     fetchData()
  },[socket])

  useEffect(() => {
    if ( socket) {
      socket.on('typing-started-from-server', (name) => 
      {
        setname(name)
        setTyping(true)
      }
      
      );
      socket.on('typing-stoped-from-server', () => 
      {
        setname('')
        setTyping(false)
      });
    }
  }, [socket]);

  return (
    <div className='bg-white h-full'>
          <div className="bg-[#3b6a87] text-white p-2 flex justify-between items-center ">
            <div className="flex items-center">
            <p className='text text-xl'>Chat</p>
            {/* <p className='text text-xs mx-2 mt-1'>( {length} online )</p> */}
            </div>
            <CloseIcon className='text-white cursor-pointer' onClick={()=>dispatch(changeChatState(false))}/>
          </div>
          <div className='h-[84%] p-4 overflow-auto'>
            {
               message.map((m)=>{
                return (
                  <>
                  <div className={`flex ${ m.sender.user_id ? (m.sender.user_id===token.id ? "justify-end" : "") :"justify-end" } my-5`}>
                  <div>
                    <div className='flex items-end '>
                    <Image src={  m.sender.user_id?(m.sender.user_id===token.id ? '/profile-logo.jpg' : (m.sender.profile.length===0 ? '/profile-logo.jpg' : m.sender.profile.length)) : '/profile-logo.jpg'} width={20} height={20} alt='profile' className='rounded-full'/>
                    <p className='text-xs text mx-1 text-slate-500'>{ m.sender.user_id ? (m.sender.user_id===token.id ? token.name : m.sender.username) : token.name}</p>
                    </div>
                    
                  <p className=' max-w-[20rem] bg-[#3b6a87] rounded-md text text-sm text-white min-w-min p-2 ml-4'>
                   {m.text.text}
                  </p>
                  <p className={`text text-end text-xs text-slate-500`}>{format(m.createdAt)}</p>
                  </div>
                 </div>
                 </>
                )
               })
            }

            {
              typing && 
              <div className={`flex  my-10`}>
                  <div>
                    <div className='flex items-end '>
                    <Image src={'/profile.jpg'} width={20} height={20} alt='profile' className='rounded-full'/>
                    <p className='text-xs text mx-1 text-slate-500'>{name}</p>
                    </div>
                    
                  <p className=' max-w-[20rem] bg-[#3b6a87] rounded-md text text-sm text-white min-w-min p-2 ml-4'>
                   Typing....
                  </p>
                  </div>
                  
                 </div>
            }
        
        
         <div ref={scrollRef}></div> 
</div>
     {
      emojii && 
      <div className=" absolute bottom-11">
            <Picker data={data} onEmojiSelect={addEmoji} emojiSize={20} emojiButtonSize={28} />
            </div>
     }

          <div className=' h-[8%] flex items-center justify-between bg-slate-100'>
            <EmojiEmotionsIcon className='mx-3 text-[#4b606d] cursor-pointer' onClick={()=>setemojii(!emojii)}/>
            <input type='text' className='w-full h-full focus:outline-none bg-slate-100 text' onKeyPress={handleKeyPress} value={newMessage}  placeholder='Send message ...' onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    handleInput(e);
                  }} ref={inputRef}/>
                  <label htmlFor='file'>
                  <Box sx={{ height:100, transform: 'translateZ(0px)', flexGrow: 1 }}>
                  <SpeedDial
          ariaLabel="SpeedDial playground example"
          icon={<AttachFileIcon  sx={{ position: 'absolute', color: '#6d8594'}}/>} 
          FabProps={{
            sx: {
              bgcolor: 'white',
              '&:hover': {
                bgcolor: 'white',
              },
              boxShadow: 'none',
            }
          }}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={()=>{console.log("Hii")}}
            />
          ))}
        </SpeedDial>
        </Box>
            </label>
            <input type='file' name='file' id='file' className='hidden'/>
            <SendIcon className="mr-3 text-[#4b606d]" onClick={handleMessage}/>
          </div>
          <Modal open={false} footer={null}>
          <Image src={'/signin.jpg'} width={300} height={300} alt='profile' className='text-center' style={{ width: 300, height: 250, overflow: 'hidden' }} />
          </Modal>
    </div>
  )
}

export default Chat