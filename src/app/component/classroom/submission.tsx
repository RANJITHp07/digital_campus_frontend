'use client'
import { FETCH_ASSIGNMENT_DETAILS } from '@/apis/assignment/query'
import { assignmentClient } from '@/app/providers/ApolloProvider'
import { useQuery } from '@apollo/client'
import {useRouter} from 'next/navigation';
import Image from "next/image"
import { Card, Typography } from "@material-tailwind/react";

const TABLE_HEAD = ["Assignment", "Type", "DueDate" ,"Topic"];

function Submission({id}:{id:string}) {

    const router=useRouter()
    const {data}=useQuery(FETCH_ASSIGNMENT_DETAILS,{
        client:assignmentClient,
        variables: { id: id },
      })
  return (
    <div className='flex justify-center'>
        <div className=' w-full md:w-3/4 my-9'>
                <div className='flex justify-between items-center'>
                <p className='text-3xl text text-[#3b6a87] mx-4'>Submission</p>
                </div>
                <hr className='border-1 rounded-full border-[#3b6a87] mb-6 mt-3'/>  
                {
                   data && data.getAllassignment.length===0 &&
                   <Image
                    src={"/submission.png"}
                    width={900}
                    height={900}
                    alt="photo"
                    className="mx-auto"
                  />
                }

              <Card className="h-full w-full">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="text leading-none opacity-70"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data.getAllassignment.map(({_id, title, assignmentType, dueDate,mainTopic }:{_id:string,title:string,assignmentType:string,dueDate:{day:string | null},mainTopic:string}, index:number) => {
            const isLast = index === data && data.getAllSubmissionlength - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
            if(["Quiz","Assignment","Polling"].includes(assignmentType))
            return (
              <tr key={title}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="text my-3 text-[#3b6a87]"
                  >
                    <a href={`/classroom/submitted?assignment=${_id}&type=${assignmentType}`} className='cursor-pointer hover:underline'>{title.length>30 ? (title.slice(0,30)+"..."): title }</a>
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="text my-3 text-[#3b6a87]"
                  >
                   {assignmentType}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="text my-3 text-[#3b6a87]"
                  >
                   {
                    (dueDate && dueDate.day)?
                    <p>{dueDate.day}</p>
                     :
                     <p>No dueDate</p>
                   }
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="text my-3 text-[#3b6a87]"
                  >
                   {
                    mainTopic ?
                    <p>{mainTopic}</p>
                    :
                    <p>No Topic</p>
                   }
                  </Typography>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>   
    </div>           
    </div>
  )
}

export default Submission