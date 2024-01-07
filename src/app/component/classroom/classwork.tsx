"use client";
import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";
import { Dropdown, MenuProps, Modal, Tooltip, message } from "antd";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ASSIGNMENT } from "@/apis/assignment/mutation";
import LoadinPage from "../common/loadinPage";
import { assignmentClient } from "@/app/providers/ApolloProvider";
import PollIcon from "@mui/icons-material/Poll";
import { Polling } from "@/@types/classroom";
import { FETCH_CLASSROOM_DETAILS } from "@/apis/classroom/query";
import { useAppSelector } from "@/redux/store";
import Material from "./material";
import { FETCH_MAINTOPIC, GROUPED_ASSIGNMENT } from "@/apis/assignment/query";

function Classwork({ id }: { id: string }) {
  const options = ["A", "B", "C", "D"];
  const [open, setopen] = useState(false);
  const [pollingquestion, setpollingquestion] = useState("");
  const [question, setquestion] = useState({
    question1: "",
    question2: "",
  });
  const token = useAppSelector((state) => state.authReducer.token);
  const [add, setadd] = useState(false);
  const [polling, setpolling] = useState<Polling[]>([]);
  const [assignment, setassignment] = useState<any>([]);
  const [state, setstate] = useState(false);
  const [topic, settopic] = useState<any>("Topics");
  const creator = useAppSelector((state) => state.classroomReducer.creator);
  const { data, loading } = useQuery(GROUPED_ASSIGNMENT, {
    client: assignmentClient,
    variables: {
      id: id,
    },
    onError(err) {
      console.log(err);
    },
    onCompleted: (data) => {
      setassignment(data.getgroupedAssignment);
    },
  });

  const { data: getClassroom } = useQuery(FETCH_CLASSROOM_DETAILS, {
    variables: {
      id: id,
    },
  });

  //handle topic
  const handleTopic = (m: string) => {
    settopic(m);
    setstate(false);
    setassignment((prev: any) => prev.filter((p: any) => p._id === m));
  };

  const { data: mainTopic } = useQuery(FETCH_MAINTOPIC, {
    client: assignmentClient,
    variables: {
      id: id,
    },
    onError(err) {
      console.log(err);
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleChange();
    }
  };

  const handleChange = () => {
    if (polling.length >= 4) {
      message.info("Maximum 4 options");
      return;
    }
    if (pollingquestion.trim().length > 0) {
      setpolling([
        ...polling,
        { number: polling.length + 1, question: pollingquestion },
      ]);
      setpollingquestion("");
    }
  };

  //to handle the polling
  const [createAssignment] = useMutation(CREATE_ASSIGNMENT, {
    onError(err) {
      console.log(err);
      message.info("Some error occurred");
    },
    onCompleted: (data) => {
      setopen(false);
      const a = assignment.map((assignment: any) => {
        if (assignment._id === null) {
          return {
            ...assignment,
            assignments: [...assignment.assignments, data.createAssignment],
          };
        }
        return assignment;
      });
      setassignment(a);
      message.info("Polling created");
    },
  });

  const hanldeSubmitPolling = async () => {
    if (question.question2.trim().length === 0) {
      message.info("Enter the question");
      return;
    }
    if (polling.length < 2) {
      message.info("Atleast two answers required");
      return;
    }
    const poll = polling.map((m) => 0);
    const answer = polling.map((m) => m.question);
    const assignments = {
      title: question.question2,
      polling: {
        answers: answer,
        polling: poll,
      },
      creator: token.name,
      assignmentType: "Polling",
      class_id: id,
      students: getClassroom.getClassroomDetails.students_enrolled,
    };
    await createAssignment({
      client: assignmentClient,
      variables: {
        assignment: assignments,
      },
    });
  };

  //items of the assignment menu
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a href={`/classroom/createAssignment?classroom=${id}&type=Assignment`}>
          <span className="text text-[#3b6a87] my-2">
            <AssignmentIcon className="text-lg" /> Assignment
          </span>
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <p className="text text-[#3b6a87] my-2">
          <HelpCenterIcon className="text-lg" /> Question
        </p>
      ),
    },
    {
      key: "3",
      label: (
        <a href={`/classroom/quiz?classroom=${id}&type=Quiz`}>
          <span className="text text-[#3b6a87] my-2">
            <AppRegistrationIcon className="text-lg" /> Quiz
          </span>
        </a>
      ),
    },
    {
      key: "4",
      label: (
        <a
          href={`/classroom/createAssignment?classroom=${id}&type=Material`}
          className="text text-[#3b6a87] my-2"
        >
          <span className="text text-[#3b6a87] my-2">
            <AutoStoriesIcon className="text-lg" /> Material
          </span>
        </a>
      ),
    },
    {
      key: "5",
      label: (
        <p className="text text-[#3b6a87] my-2" onClick={() => setopen(true)}>
          <PollIcon className="text-lg" /> Polling
        </p>
      ),
    },
  ];

  return (
    <div className="flex justify-center">
      {loading ? (
        <LoadinPage />
      ) : (
        <>
          <div className=" w-full md:w-3/4 my-9">
            <div className="flex justify-between items-center">
              <p className="text-3xl text text-[#3b6a87] mx-4">Assignments</p>
              <>
                {creator && (
                  <Dropdown menu={{ items }} placement="bottomLeft">
                    <div className="mx-3">
                      <AddIcon className="text-[#3b6a87] md:hidden mx-4" />
                      <button className="bg-[#3b6a87] text-white p-2 rounded-full pr-4 md:flex items-center hidden">
                        <AddIcon />
                        Create
                      </button>
                    </div>
                  </Dropdown>
                )}
              </>
            </div>
            <hr className="border-1 rounded-full border-[#3b6a87] mb-6 mt-3" />
            {loading ? (
              <LoadinPage />
            ) : (
              <>
                <div className="border-2 border-[#7195aa]  w-12/12 mx-2 md:w-1/2 xl:w-1/3 h-12 flex items-center justify-between">
                  <p className="text text-[#3b6a87] mx-3">{topic}</p>
                  <ArrowDropDownIcon
                    className="text-[#3b6a87] cursor-pointer"
                    onClick={() => {
                      setassignment(data.getgroupedAssignment);
                      setstate(true);
                    }}
                  />
                </div>
                {state && (
                  <div className="bg-white absolute box_shadow mx-2  w-[20rem] p-2 rounded-md">
                    <p
                      className="my-3 cursor-pointer text text-slate-500"
                      onClick={() => {
                        setstate(false);
                        settopic("Topics");
                        setassignment(data.getgroupedAssignment);
                      }}
                    >
                      All topics
                    </p>
                    <hr />
                    {mainTopic &&
                      mainTopic.getdistinctmainTopic.mainTopic.map(
                        (m: string) => {
                          return (
                            <>
                              <p
                                className="my-3 cursor-pointer text text-slate-500"
                                onClick={() => handleTopic(m)}
                              >
                                {m}
                              </p>
                              <hr />
                            </>
                          );
                        }
                      )}
                  </div>
                )}

                {assignment.length > 0 ? (
                  assignment.map((a: any) => {
                    return (
                      <div className="my-9">
                        <div className="flex justify-between items-center">
                          <p className="text-3xl text text-[#3b6a87] mx-4">
                            {a._id}
                          </p>
                        </div>
                        {a._id && (
                          <hr className="border-1 rounded-full border-[#3b6a87] mb-6 mt-3" />
                        )}

                        {a.assignments.map((a: any, index: number) => {
                          return (
                            <>
                              <Material
                                material={a}
                                assignment={assignment}
                                setassignment={setassignment}
                                id={id}
                              />
                              <hr />
                            </>
                          );
                        })}
                      </div>
                    );
                  })
                ) : (
                  <Image
                    src={"/noassignment.jpg"}
                    width={300}
                    height={300}
                    alt="photo"
                    className="mx-auto"
                  />
                )}
              </>
            )}
          </div>

          <Modal
            title={
              <span className="text font-normal text-[#3b6a87]">
                Polling for the students
              </span>
            }
            open={open}
            footer={null}
            onCancel={() => {
              setopen(false);
              setadd(false);
              setpolling([]);
              setquestion({
                question1: "",
                question2: "",
              });
            }}
          >
            <div className="flex items-center justify-between border-slate-300 rounded-md border-2 px-1">
              <input
                type="text"
                className=" w-11/12 p-2 focus:outline-none  text"
                placeholder="Ask a polling question"
                value={question.question1}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setquestion({
                    question1: e.target.value,
                    question2: e.target.value,
                  });
                  setadd(false);
                }}
              />
              <Tooltip placement="topRight" title={"add the polling answers"}>
                <AddIcon
                  className="m-1 text-slate-400 cursor-pointer"
                  onClick={() => {
                    setadd(true);
                    setquestion({ ...question, question1: "" });
                  }}
                />
              </Tooltip>
            </div>
            {add && question.question2.trim().length > 0 && (
              <p className="text mt-5 mb-2">
                {question.question2[0].toUpperCase() +
                  question.question2.slice(1, question.question2.length)}
              </p>
            )}
            {polling.map((p, index) => {
              return (
                <div className="my-5 flex items-center w-full">
                  <p className="text">{options[index]} .</p>
                  <p className="text ">{p.question}</p>
                </div>
              );
            })}
            {add && polling.length < 4 && (
              <div className="my-5 flex items-center w-full">
                <input
                  type="radio"
                  className="transform scale-150 mr-3 text-[#3b6a87] cursor-pointer  accent-[#3b6a87]"
                  checked
                />
                <input
                  type="text"
                  placeholder={`Option ${options[polling.length]}`}
                  className="border-b-2 w-full text border-slate-500 focus:outline-none"
                  value={pollingquestion}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setpollingquestion(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                />
              </div>
            )}
            <div className="flex justify-end my-2">
              <button
                type="submit"
                className="text-white p-2 border-2 bg-[#3b6a87] rounded-md px-4 text "
                onClick={hanldeSubmitPolling}
              >
                Submit
              </button>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}

export default Classwork;
