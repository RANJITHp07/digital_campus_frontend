'use client'
import { CREATE_SUBMISSION } from '@/apis/submission';
import { submissionClient } from '@/app/providers/ApolloProvider';
import { useAppSelector } from '@/redux/store';
import { useMutation } from '@apollo/client';
import { message } from 'antd';
import React, { useState } from 'react';

function Polling({ details,creator,polling }: { details: any ,creator?:boolean,polling?:any}) {
  console.log(details)
  const data=["A","B","C","D"]
  const [comment,setcomment]=useState([])
  const token=useAppSelector((state)=>state.authReducer.token)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleRadioChange = (answer: string) => {
    setSelectedAnswer(answer);
  };

  //to submit the polling
  const [createSubmission]=useMutation(CREATE_SUBMISSION,{
    onError(err){
      console.log(err)
      message.info(err.graphQLErrors[0].message)
    },
    onCompleted:()=>{
      message.info("successfully submitted")
    }
  })

  console.log(details)
  const handleSubmission=async()=>{
    const submission={
      assignment_id:details._id,
      pollingAnswers:selectedAnswer as string,
      username:token.name,
      user_id:token.id
    }
    console.log(submission)
    await createSubmission({
      client:submissionClient,
      variables:{
        submission
      }
    })
  }

  return (
    <div>
      <p className='text text-2xl text-[#3b6a87] mx-6'>
        Question : {details.title[0].toUpperCase() + details.title.slice(1, details.title.length).toLowerCase()}
      </p>
      {details.polling.answers.map((m: string,index:number) => (
        <div key={m} className='my-5 flex items-center w-full mx-6'>
          {
            !creator ?
            <input
            type="radio"
            className="transform scale-150 mr-3 text-[#3b6a87] cursor-pointer accent-[#3b6a87]"
            name="pollingGroup"
            checked={selectedAnswer === m}
            onChange={() => handleRadioChange(m)}
          />
          :
          <p className='text text-slate-600'>{data[index]}. </p>
          }
          <p className='text text-slate-600'>{m} </p>
          {
            creator && 
            <p className='text text-slate-600 '>- {parseInt(polling.polling[index])/details.students.length * 100} %</p>
          }
          
        </div>
      ))}
  {
    !creator  && 
    <button className='text-white bg-[#3b6a87] p-3 w-11/12 lg:w-3/4 my-5 mx-3 text-center text rounded-md' onClick={handleSubmission}>Submit</button>
  }
    </div>
  );
}

export default Polling;
