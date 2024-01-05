'use client'
import React,{useState} from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { useQuery } from "@apollo/client";
import { GET_REPORTED_CLASSROOMS } from "@/apis/classroom";
 
export function Reported() {
  const [open, setOpen] = useState(1);
  const {data}=useQuery(GET_REPORTED_CLASSROOMS,{
    onError(err){
      console.log(err)
    },
    onCompleted:(data)=>{
         setclassroom(data.reportedClassroom)
    }
})
const [pagination,setpagination]=useState(1)
const[classroom,setclassroom]=useState([])
 
  const handleOpen = (value:any) => setOpen(open === value ? 0 : value);
 
  return (
    <>
    <p className="text-xl my-7 text-slate-600">Reported classrooms</p>
    {
        classroom.map((m:any,index)=>{
            return (
                <Accordion open={open === index+1} className="box_shadow my-5 rounded-md">
                <AccordionHeader onClick={() => handleOpen(index+1)} className='text p-2 text-md font-normal'>
                    <div>
                    <p>ClassName : {m.className}</p>
                    <p className="text-left">ClassCode : {m.classCode}</p>
                    </div>
                </AccordionHeader>
                <AccordionBody className='text text-slate-500 text-md p-2'>
                  {
                  m.reason.map((a:any)=>{
                  return (
                       <>
                       <div className="my-3">
                    <p>Title : {a.title}</p>
                    <p>Reported User: {a.reporter}</p>
                    <p>{a.description}</p>
                  </div>
                  <hr className="my-3"/>
                       </>
                  )
                  })
                  }
                </AccordionBody>
              </Accordion>
            )
        })
    }
      
    </>
  );
}