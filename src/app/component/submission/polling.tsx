import React from 'react'

function Polling() {
  return (
    <div>
      <p className='text text-2xl text-[#3b6a87] mx-6'>
            Question : What is you favourite color
          </p>
          <div className='my-5 flex items-center w-full mx-6'>
        <input type="radio" className="transform scale-150 mr-3 text-[#3b6a87] cursor-pointer  accent-[#3b6a87]" />
          <p className=' w-full text text-slate-600'> Red</p>
        </div>
        <div className='my-5 flex items-center w-full mx-6'>
        <input type="radio" className="transform scale-150 mr-3 text-[#3b6a87] cursor-pointer  accent-[#3b6a87]"  />
          <p className=' w-full text text-slate-600'> Green</p>
        </div>
        <div className='my-5 flex items-center w-full mx-6'>
        <input type="radio" className="transform scale-150 mr-3 text-[#3b6a87] cursor-pointer  accent-[#3b6a87]" />
          <p className=' w-full text text-slate-600'> Yellow</p>
        </div>
        <div className='my-5 flex items-center w-full mx-6'>
        <input type="radio" className="transform scale-150 mr-3 text-[#3b6a87] cursor-pointer  accent-[#3b6a87]"/>
          <p className=' w-full text text-slate-600'> Brown</p>
        </div> 
    </div>
  )
}

export default  Polling