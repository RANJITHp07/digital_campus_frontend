'use client'
import React, { useState } from 'react';

function Polling({ details }: { details: any }) {
  const [comment,setcomment]=useState([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleRadioChange = (answer: string) => {
    setSelectedAnswer(answer);
  };

  return (
    <div>
      <p className='text text-2xl text-[#3b6a87] mx-6'>
        Question : {details.title[0].toUpperCase() + details.title.slice(1, details.title.length).toLowerCase()}
      </p>
      {details.polling.answers.map((m: string) => (
        <div key={m} className='my-5 flex items-center w-full mx-6'>
          <input
            type="radio"
            className="transform scale-150 mr-3 text-[#3b6a87] cursor-pointer accent-[#3b6a87]"
            name="pollingGroup"
            checked={selectedAnswer === m}
            onChange={() => handleRadioChange(m)}
          />
          <p className='w-full text text-slate-600'>{m}</p>
        </div>
      ))}
    </div>
  );
}

export default Polling;
