'use client'
import React,{useState,useEffect} from 'react'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Quiz } from '@/@types/assignment';
import LoadinPage from '../common/loadinPage';
import Image from 'next/image';
import { useMutation } from '@apollo/client';
import { CREATE_SUBMISSION } from '@/apis/submission/mutation';
import { message } from 'antd';
import { useAppSelector } from '@/redux/store';
import { useSearchParams } from 'next/navigation';
import { submissionClient } from '@/app/providers/ApolloProvider';
import { useRouter } from 'next/navigation';

interface QuizSubmissionProps{
    title:string,
    quiz:Quiz[],
    dueDate:{
        day:string,
        timer:string[]
    }
}

function QuizSubmission({quiz,title,dueDate}:QuizSubmissionProps) {
    const router=useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get('assignment') as string
    const [answers,setAnswers]=useState<any>({})
    const [timeRemaining, setTimeRemaining] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading,setIsLoading]=useState(true)
    const [mark,setmark]=useState(0);
    const [open,setopen]=useState(false)
    const token=useAppSelector((state)=>state.authReducer.token)

    

    useEffect(() => {
        const checkOpeningHours = () => {
          const now = new Date();
          const currentIST = now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
          const currentDate = new Date(currentIST);

          const quizDate = new Date(dueDate.day);
    // Check if the due date is the same as the current date
    const isSameDate = currentDate.getFullYear() === quizDate.getFullYear() &&
                       currentDate.getMonth() === quizDate.getMonth() &&
                       currentDate.getDate() === quizDate.getDate();
       
         if(isSameDate){
          const openingTimesUTC = dueDate.timer.map(time => {
            const [hoursStr, minutesStr, secondsStr] = time.split(':');
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        const seconds = parseInt(secondsStr, 10);
            const openingTimeUTC = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hours, minutes, seconds);
            return openingTimeUTC;
          });

          const isOpen = currentDate >= openingTimesUTC[0] && currentDate <= openingTimesUTC[1];
          setIsOpen(isOpen);
    
          if (isOpen) {
            // Calculate time remaining until closing
            const remainingMillis = openingTimesUTC[1].getTime() - currentDate.getTime();
            const hours = Math.floor(remainingMillis / (1000 * 60 * 60));
            const minutes = Math.floor((remainingMillis % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingMillis % (1000 * 60)) / 1000);
    
            setTimeRemaining(`${hours}:${minutes}:${seconds}`);
          }
        };
        setIsLoading(false)
        }
        const interval = setInterval(checkOpeningHours, 1000);

    
    // Initial check when the component mounts
    checkOpeningHours();
    return () => clearInterval(interval);

  }, []);
    

    const handleChange = (a: string, type: string, index: number) => {
        if (type === 'checkbox') {
            if (answers[index]) {
                if (answers[index].includes(a)) {
                    setAnswers((prev: any) => ({
                        ...prev,
                        [index]: prev[index].filter((p: string) => p !== a),
                    }));
                } else {
                    setAnswers((prev: any) => ({
                        ...prev,
                        [index]: [...prev[index], a],
                    }));
                }
            } else {
                setAnswers((prev: any) => ({
                    ...prev,
                    [index]: [a],
                }));
            }
        } else if (type === 'radio') {
            setAnswers((prev: any) => ({
                ...prev,
                [index]: [a],
            }));
        }
    };

    const [createSubmission]=useMutation(CREATE_SUBMISSION,{
        onError(err){
          console.log(err)
        },
        onCompleted:(data)=>{
           message.info("Successfully earned "+ data.createSubmission.marks + "points")
           setmark(data.createSubmission.marks);
           setopen(true)
           
        }
      })


    const handleSubmit=async()=>{
         const minKey = Math.min(...Object.keys(answers).map(Number));
const maxKey = Math.max(...Object.keys(answers).map(Number));
for (let i = minKey + 1; i < maxKey; i++) {
    if (!(i in answers)) {
        answers[i] = [];
    }
  }
   console.log( Object.values(answers))
   const submission:any={
    assignment_id:id,
    username:token.name,
    user_id:token.id,
    quizAnswers:Object.values(answers)
  }

  console.log(submission)
    
  await createSubmission({
    client:submissionClient,
    variables:{
      submission
      }
    }
   )
    
    }
    
  return (
    <div >
        {
           isLoading ? <LoadinPage/> : !isOpen ? <div>
                <div className="mx-auto w-11/12 box_shadow my-8 rounded-md  ">
                <div className='bg-[#3b6a87] p-4 rounded-t-md flex justify-between items-center'>
      <p className='text-white text text-xl'>Quiz</p>
      <p className='text text-red-300 mx-5'>Quiz not yet started</p>
    </div>
    <div className='p-5'>
        <p className='text-slate-500 mb-4  text-2xl '>{title[0].toUpperCase() + title.slice(1,title.length).toLowerCase()}</p>
    <p className='mt-3 text text-slate-500'>Instructions</p>
    <ul className='text-slate-500 text'>
      <li><FiberManualRecordIcon className='text-xs'/> For checkbox questions, choose one or more correct options.</li>
      <li className='my-1'><FiberManualRecordIcon className='text-xs'/> For radio questions, select the single correct answer.</li>
      <li className='my-1'><FiberManualRecordIcon className='text-xs'/> Carefully read all questions and options before choosing.</li>
      <li className='my-1'><FiberManualRecordIcon className='text-xs'/> Submit your answers before the timer expires.</li>
      <li className='my-1'><FiberManualRecordIcon className='text-xs'/> Review your choices; changes can't be made after submission.</li>
      <li className='my-1'><FiberManualRecordIcon className='text-xs'/>  Points are awarded based on correct answers.</li>
    </ul>
    </div>
    <Image src={'/timer.gif'} width={ 300} height={300} alt='photo' className='mx-auto opacity-60'/>
    </div>
    </div>
        :
        ( open ? <div className="mx-auto w-11/12 box_shadow my-8 rounded-md  ">
        <div className='bg-[#3b6a87] p-4 rounded-t-md flex justify-between items-center'>
<p className='text-white text text-xl'>Quiz</p>
<p className='text-white text text-xl'>Marks : {mark}</p>
</div>
<p className='p-5 text-xl text'>Quiz completed successfully!!!!!</p>

</div>
        :
        <>
        <div className=" w-11/12 mx-auto mt-8  box_shadow rounded-md relative">
        <div className='bg-[#3b6a87] p-4 rounded-t-md flex justify-between items-center'>
      <p className='text-white text text-xl'>Quiz</p>
      <p className='text text-white'>{timeRemaining}</p>
    </div>
    <div className='p-5'>
        <p className='text-slate-500 mb-4  text-2xl '>{title[0].toUpperCase() + title.slice(1,title.length).toLowerCase()}</p>
    <p className='mt-3 text text-slate-500'>Instructions</p>
    <ul className='text-slate-500 text'>
      <li><FiberManualRecordIcon className='text-xs'/> For checkbox questions, choose one or more correct options.</li>
      <li className='my-1'><FiberManualRecordIcon className='text-xs'/> For radio questions, select the single correct answer.</li>
      <li className='my-1'><FiberManualRecordIcon className='text-xs'/> Carefully read all questions and options before choosing.</li>
      <li className='my-1'><FiberManualRecordIcon className='text-xs'/> Submit your answers before the timer expires.</li>
      <li className='my-1'><FiberManualRecordIcon className='text-xs'/> Review your choices; changes can't be made after submission.</li>
      <li className='my-1'><FiberManualRecordIcon className='text-xs'/>  Points are awarded based on correct answers.</li>
    </ul>
    </div>
    </div>
    <div>
        {
            quiz.map((q,index)=>{
                return (
                    <>
                       <div  className="w-11/12 mx-auto my-8 box_shadow rounded-md p-4">
        
        <p className='text text-slate-500 mx-2 text-lg'>{index+1}. {q.question}</p>
        {
            q.answers.map((a)=>{
                return (
                    <>
                     <div className='flex my-3 mx-2 text-[#3b6a87] '>
            <input type={q.type==='checkbox'?"checkbox":"radio"} className="transform scale-150  mx-3 text-[#3b6a87] cursor-pointer  accent-[#3b6a87]" checked={answers[index] && answers[index].includes(a)} onChange={()=>handleChange(a,q.type,index)} />
        <p className='text'>{a}</p>
        </div>
                    </>
                
                )
            })
        }
         </div>
                    </>
                
                )
            })
        }
    </div>
     
    <div className='flex justify-end w-11/12 mx-auto'>
        <button className='p-2 bg-[#3b6a87]  text text-white rounded-md mb-4' onClick={handleSubmit}>Submit</button>
    </div>
    </>
        )
}
    </div>
  )
}

export default QuizSubmission