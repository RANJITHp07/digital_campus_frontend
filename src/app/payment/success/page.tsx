import React from 'react'

function Success() {
  return (
    <div className="flex justify-center">
        <div className="box_shadow flex justify-center my-24 w-1/2 p-9 rounded-md">
            <div>
        <img src={'https://i.pngimg.me/thumb/f/720/m2H7i8N4K9H7d3A0.jpg'} className="w-36 h-32 mx-auto"/>
        <p className='text text-xl my-3 text-center'>Payment success full</p>
        <a href={'/classroom'} className='text text-blue-300 my-3 text-center block'>Go to home page</a>
        </div>
        </div>
        
    </div>
  )
}

export default Success