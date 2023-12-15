'use client'
import React,{ChangeEvent, useRef,useState,useEffect} from 'react'
import CloseIcon from '@mui/icons-material/Close';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import data from '@emoji-mart/data'
import Image from 'next/image'
import { AppDispatch, useAppSelector} from '@/redux/store';
import { useDispatch } from 'react-redux';
import { changeChatState } from '@/redux/features/classroom-slice/reducer';
import Picker from '@emoji-mart/react'
import { Socket } from 'socket.io-client';
import { getMessage } from '@/apis/chat';
import {format} from "timeago.js"
import { Modal} from 'antd';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import VideocamIcon from '@mui/icons-material/Videocam';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Tooltip from '@mui/material/Tooltip';
import SendIcon from '@mui/icons-material/Send';
import {pdfjs,Document,Page} from 'react-pdf'
import dataType from '@/services/data/photoTypes';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../../../services/config/firebase"
import { v4 } from "uuid";
import { CircularProgress } from '@mui/material';


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
  const [file,setfile]=useState<File |null>(null)
  const [isHovered,setIshovered]=useState(false)
  const [desc,setdesc]=useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading,setloading]=useState(true)
  const [scroll,setscroll]=useState(0)
  const [skip,setskip]=useState(0)

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
  ).toString();
  


  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }:{numPages:any}) => {
    setNumPages(numPages);
  };


  const handleOpenFileDialog = (type: string) => {
    if (fileInputRef.current) {
      settype(type);
      setIshovered(false)
      fileInputRef.current.setAttribute('accept', dataType[type as keyof typeof dataType]);

      fileInputRef.current.click();
    }
  };

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
     if(newMessage.trim().length>0){
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
       setmessage( (prev)=>[...prev,m])
     })
  },[socket])

  useEffect(()=>{
     const fetchData=async()=>{
       const res=await  getMessage(classId,skip)
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

  const imagesListRef = ref(storage, "images/");

  //handle uploading of file
  const handleUplaoding=()=>{
    try{
      if (file == null) return;
      const t={
        classId:classId,
        sender:token.id,
        text:{
          type:type,
          text:URL.createObjectURL(file),
          desc:desc.trim().length>0 && desc
        }
       }
       setmessage([...message,t])
      const imageRef = ref(storage, `images/${file.name + v4()}`);
      uploadBytes(imageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async(url) => {
           const text={
            classId:classId,
            sender:token.id,
            text:{
              type:type,
              text:url,
              desc:desc.trim().length>0 && desc
            }
           }
           setfile(null)
           socket.emit('sendMessage', { classId:classId,message:text});
        });
      });
    }catch(err){
      throw err
    }
  }

  const handleScroll = async(event:React.UIEvent<HTMLDivElement>) => {
    const { scrollTop} = event.currentTarget;
    if(scrollTop>500){
      const res=await getMessage(classId,skip+10)
      console.log(res.data.data.reverse())
     setskip((prev)=>prev+10)
     setscroll(0)
    }
  };

  return (
    <div className='bg-white h-full'>
          <div className="bg-[#3b6a87] text-white p-2 flex justify-between items-center ">
            <div className="flex items-center">
            <p className='text text-xl'>Chat</p>
            {/* <p className='text text-xs mx-2 mt-1'>( {length} online )</p> */}
            </div>
            <CloseIcon className='text-white cursor-pointer' onClick={()=>dispatch(changeChatState(false))}/>
          </div>
          <div className='h-[87%] xl:h-[84%] lg:h-[85%] p-4 overflow-auto relative' onScroll={handleScroll}>
            {
                 
                 isHovered && <div className='fixed bottom-8 md:bottom-16 xm:bottom-9 lg:bottom-12 right-11 z-50'
                    onMouseLeave={() =>
                    {
                      setTimeout(() => {
                        setIshovered(false);
                      }, 800);
                    }
                  }
                 >
      <div className='box_shadow p-2 rounded-full text-[#4b606d] delay-00 bg-white hover:scale-105 hover:bg-slate-100' onClick={() =>
        { 
          handleOpenFileDialog('pdf')
        }}>
        <Tooltip title="Pdf" placement="left">
          <FileCopyIcon className='cursor-pointer'/>
        </Tooltip>
      </div>
      <div className='box_shadow p-2 rounded-full my-3 text-[#4b606d]  bg-white hover:scale-105 hover:bg-slate-100' onClick={() =>
        {
          handleOpenFileDialog('photo')
          
      }
        }>
        <Tooltip title="Photo" placement="left">
          <PhotoLibraryIcon className='cursor-pointer'/>
        </Tooltip>
      </div>
      <div className='box_shadow p-2 rounded-full my-3 text-[#4b606d]  bg-white hover:scale-105 hover:bg-slate-100' onClick={() =>
        {
          handleOpenFileDialog('audio')
        }
        }>
        <Tooltip title="Audio" placement="left">
          <AudiotrackIcon className='cursor-pointer'/>
        </Tooltip>
      </div>
      <div className='box_shadow p-2 rounded-full text-[#4b606d] delay-00 bg-white hover:scale-105 hover:bg-slate-100' onClick={() =>
        {
          handleOpenFileDialog('vedio')
        }
        }>
        <Tooltip title="Video" placement="left">
          <VideocamIcon className='cursor-pointer'/>
        </Tooltip>
      </div>
    </div>

            }
            {
               message.map((m)=>{
                return (
                  <>
                  <div className={`  flex  ${ m.sender.user_id ? (m.sender.user_id===token.id ? "justify-end" : "") :"justify-end" } my-5`}>
                  <div >
                    <div className='flex items-end '>
                    <Image src={  m.sender.user_id?(m.sender.user_id===token.id ? '/profile-logo.jpg' : (m.sender.profile.length===0 ? '/profile-logo.jpg' : m.sender.profile.length)) : '/profile-logo.jpg'} width={20} height={20} alt='profile' className='rounded-full'/>
                    <p className='text-xs text mx-1 text-slate-500'>{ m.sender.user_id ? (m.sender.user_id===token.id ? token.name : m.sender.username) : token.name}</p>
                    </div>
                    {
                        m.text.type==='text'
                        && 
                        <p className=' max-w-[20rem] bg-[#3b6a87] rounded-md text text-sm text-white min-w-min p-2 ml-4'>
                   {m.text.text}
                  </p>
                      }
                      
                      {
                        m.text.type==='audio' && 
                        <audio controls className="w-[20rem]">
          <source src={m.text.text} type="audio/mp3"/>
      </audio>
                      }
              {
                m.text.type==='photo' && 
                <a href={m.text.text} target="_blank" rel="noopener noreferrer" ><Image src={m.text.text}  width={300} height={300} alt='profile' className='text-center w-[19rem] cursor-pointer  object-contain' onLoad={()=>setloading(false)}/></a>
                
              }
              {
                m.text.type==='vedio' && 
                <a href={m.text.text} target="_blank" rel="noopener noreferrer" ><video src={m.text.text} controls  className='w-[19rem]'/></a>
              }
              {
  m.text.type === 'pdf' && (
    <a href={m.text.text} target="_blank" rel="noopener noreferrer" >
    <Document file={m.text.text} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={1}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          height={300}
          width={300}
        />
      </Document>
      </a>
  )
}

{
   m.text.desc && 
   <p className="bg-slate-100 text w-[19rem] text-[#4b606d] rounded-b-md text-sm p-3">{m.text.desc}
   </p>
}

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
          {loading && (
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <CircularProgress className='text-slate-300'/>
        </div>
      )}
            <EmojiEmotionsIcon className='mx-3 text-[#4b606d] cursor-pointer' onClick={()=>setemojii(!emojii)}/>
            <input type='text' className='w-full h-full focus:outline-none bg-slate-100 text' onKeyPress={handleKeyPress} value={newMessage}  placeholder='Send message ...' onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    handleInput(e);
                  }} ref={inputRef}/>
                  <AttachFileIcon className="rotate-45 mx-3 text-[#4b606d] cursor-pointer my-1" id="file" 
                    onClick={() => setIshovered(!isHovered)}
                  />
            <input type='file' name='file' id='file' className='hidden'  ref={fileInputRef} onChange={(e:ChangeEvent<HTMLInputElement>) => 
              {
                if(e.target.files){
                  
                  setfile(e.target.files[0])}
              }
              }/>
            <SendIcon className="mr-3 text-[#4b606d]" onClick={handleMessage}/>
          </div>
          <Modal title={<span className="text font-normal text-slate-500">Post</span>} open={file? true : false} footer={null} onCancel={()=>setfile(null)}>
            <div className="flex justify-center">
              {
                type==='audio' && file && 
                <audio controls className="w-full">
          <source src={URL.createObjectURL(file)} type="audio/mp3"/>
      </audio>
              }
              {
                type==='photo' && file && 
                <Image src={URL.createObjectURL(file)} width={300} height={300} alt='profile' className='text-center object-cover w-56 h-56' />

              }
              {
                type==='vedio' && file && 
                <video src={URL.createObjectURL(file)} controls  className='w-full'/>
              }
              {
  type === 'pdf' && file && (
    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={1}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          height={200}
        />
      </Document>
  )
}
          
          </div>
          <div className='flex bg-slate-200 w-full p-2 mt-5 rounded-full'>
            <input type='text' placeholder='Add message with the post' className='text focus:outline-none w-full bg-slate-200' onChange={(e:ChangeEvent<HTMLInputElement>)=>setdesc(e.target.value)}/>
            <SendIcon className='text-[#4b606d] cursor-pointer' onClick={handleUplaoding}/>
          </div>
          </Modal>
    </div>
  )
}

export default Chat