import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


function LoadinPage() {
  return (
    <div className="mx-5   my-12 w-full">
        <div className="flex">
          <div className="w-1/4">
          <Skeleton height={300}  className="my-5" />
          </div>
          <div className="w-3/4 ml-3">
          <Skeleton height={90}  className="my-1 mt-5" />
          <Skeleton height={90} className="my-2" />
          <Skeleton height={90}  className="my-2" />
          </div>
        </div>
        <Skeleton height={350} className="my-5" />  
        <Skeleton count={2} height={100} className="my-5"/>

    </div>
  )
}

export default LoadinPage