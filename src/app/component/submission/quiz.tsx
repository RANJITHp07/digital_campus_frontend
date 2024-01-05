'use client'
import React,{useState,useEffect} from 'react'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Quiz } from '@/@types/assignment';

interface QuizSubmissionProps{
    title:string,
    quiz:Quiz[],
    dueDate:{
        day:string,
        timer:string[]
    }
}

function QuizSubmission({quiz,title,dueDate}:QuizSubmissionProps) {
    const [answers,setAnswers]=useState<any>({})
    const [timeRemaining, setTimeRemaining] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading,setIsLoading]=useState(false)

    

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
        console.log(isSameDate)
        console.log("Jiii")
       
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
        setIsLoading(true)
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
    
  return (
    <div >
        {
            !isOpen ? <div>
                <div className="mx-auto w-11/12 box_shadow">
                <div className='bg-[#3b6a87] p-4 rounded-t-md flex justify-between items-center'>
      <p className='text-white text text-xl'>Quiz</p>
    </div>
    
    </div>
            </div>
        :
        <>
        <div className=" w-11/12 mx-auto mt-8  box_shadow rounded-md relative">
        <div className='bg-[#3b6a87] p-4 rounded-t-md flex justify-between items-center'>
      <p className='text-white text text-xl'>Quiz{timeRemaining}</p>
    </div>
    <div className='p-5'>
        <p className='text-slate-500 mb-4  text-2xl '>{title[0].toUpperCase() + title.slice(0,title.length).toLowerCase()}</p>
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
        <button className='p-2 bg-[#3b6a87]  text text-white rounded-md mb-4'>Submit</button>
    </div>
    </>
}
    </div>
  )
}

export default QuizSubmission