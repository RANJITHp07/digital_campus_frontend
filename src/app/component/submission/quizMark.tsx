'use client'
import { UPDATE_GRADE } from "@/apis/submission/mutation";
import { GET_ASSIGNMENT } from "@/apis/submission/query";
import { submissionClient } from "@/app/providers/ApolloProvider";
import useFormattedCreator from "@/hook/useFormat";
import { useAppSelector } from "@/redux/store";
import { useMutation, useQuery } from "@apollo/client";
import { Card, Typography } from "@material-tailwind/react";
import { message } from "antd";
import { useState } from "react";

const TABLE_HEAD = ["Name", "Answered", "Mark","Status" ];


function QuizMark({id,data:material}:{id:string,data:any}) {
  
  const token=useAppSelector((state)=>state.authReducer.token)
  const {data}=useQuery(GET_ASSIGNMENT,{
    client:submissionClient,
    onError(err){
      console.log(err)
    },
      variables:{
        id:id
      }
  })

  return (
    <div className='flex justify-center'>
        <div className=' w-full md:w-11/12 my-9'>
      <div className='flex justify-between items-center'>
                <p className='text-3xl text text-[#3b6a87] mx-4'>{useFormattedCreator(material.title)}</p>
                </div>
                <hr className='border-1 rounded-full border-[#3b6a87] mb-6 mt-3'/>  
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
                  className="font-normal leading-none opacity-70"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data.getAllSubmission.map(({user_id, username, quizAnswers, submission }:{user_id:string,username:string,quizAnswers:any,submission:any}, index:number) => {
            const isLast = index === data && data.getAllSubmissionlength - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            return (
              <tr key={username}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="text my-3 text-[#3b6a87]"
                  >
                    {username}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="text my-3 text-[#3b6a87]"
                  >
                   {quizAnswers.length}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="text my-3 text-[#3b6a87]"
                  >
                   {submission.grade}/
                   {material.quiz.length}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className={`text my-3 ${submission.status=='Late submitted' ? "text-red-500" : "text-green-500"}`}
                  >
                    {submission.status}
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
  );
}

export default QuizMark
