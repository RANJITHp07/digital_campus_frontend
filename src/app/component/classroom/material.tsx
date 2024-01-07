"use client";
import AutoFixNormalIcon from "@mui/icons-material/AutoFixNormal";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import LiveHelpOutlinedIcon from "@mui/icons-material/LiveHelpOutlined";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import PollIcon from "@mui/icons-material/Poll";
import { format } from "timeago.js";
import { Dropdown, MenuProps, Modal, message } from "antd";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  DELETE_ASSIGNMENT,
  EDIT_ASSIGNMENT,
  EDIT_POLLING,
} from "@/apis/assignment/mutation";
import { assignmentClient } from "@/app/providers/ApolloProvider";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { Assignment, Polling } from "@/@types/assignment";
import { CircularProgress } from "@mui/material";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DoneOutlined from "@mui/icons-material/DoneOutlined";
import { useNavDispatch } from "@/hook/useNavDispatch";
import useFormattedCreator from "@/hook/useFormat";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import QuizIcon from '@mui/icons-material/Quiz';
import AssignmentIcon from "@mui/icons-material/Assignment";

interface MaterialProps{
  material:  any;
  assignment: Assignment[];
  setassignment: React.Dispatch<React.SetStateAction<Assignment[]>>
  ;
  id: string;
}

function Material({
  material,
  assignment,
  setassignment,
  id,
}: 
  MaterialProps
) {

  let options = ["A", "B", "C", "D"];
  const {navigation,appSelector}=useNavDispatch()
  const [add, setAdd] = useState(false);
  const token = appSelector((state) => state.authReducer.token);
  const [text, setText] = useState("");
  const [option, setOption] = useState("");
  const [editIndex, setEditIndex] = useState(5);
  const [open, setopen] = useState(false);
  const pollingInitialState: Polling = useMemo(
    () => ({
      __typename: "",
      title: material.title,
      polling: {
        __typename: "",
        answers: [],
      },
      students: [],
    }),
    [material.title]
  );

  const [polling, setPolling] = useState<Polling>(pollingInitialState);

  const [pollingQuery, { loading }] = useLazyQuery(EDIT_POLLING, {
    client: assignmentClient,
    onError(err) {
       message.info("Some error occurred")
    },
    onCompleted: (data) => {
      setPolling(data.getOneassignment);
    },
  });

  const [deleteAssignment] = useMutation(DELETE_ASSIGNMENT, {
    client: assignmentClient,
    variables: {
      id: material._id,
    },
    onError(err) {
      message.info("Some error occurred")
    },
    onCompleted: (data) => {
      const { mainTopic, ...newData } = data.deleteAssignment;

      const a = assignment.map((m: any) => {
        if (m._id === mainTopic) {
          return {
            ...m,
            assignments: m.assignments.filter(
              (m: any) => m._id != data.deleteAssignment._id
            ),
          };
        }
        return m;
      });
      setassignment(a);
      message.info("Deleted successfully");
    },
  });

  const [updateAssignment] = useMutation(EDIT_ASSIGNMENT, {
    client: assignmentClient,
    onError(err) {
      message.error("Some error occured")
    },
    onCompleted: () => {
      setopen(false);
    },
  });

  //to update the polling
  const updatePolling = useCallback(async () => {
    if (polling.title.trim().length === 0) {
      message.error("Title is important");
      return;
    }

    const { __typename: type, students, title, polling: { __typename, ...p } } =
      polling;

    const updatedPolling = {
      title,
      students,
      polling: { ...p },
    };

    const updatedAssignment = {
      ...updatedPolling,
      creator: token.name,
      class_id: [id],
      assignmentType: "Polling",
    };

    await updateAssignment({
      client: assignmentClient,
      variables: {
        id: material._id,
        update: updatedAssignment,
      },
    });
  }, [polling, token.name, id, material._id, updateAssignment]);

  // to open the model to delete
  function handleEdit() {
    try {
      setopen(true);
      pollingQuery({
        variables: {
          id: material._id,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  //to edit the options
  const handlEditOptions = (i: number) => {
    const a = polling.polling.answers.map((a, index) => {
      if (index === i) {
        return text;
      }
      return a;
    });
    setPolling({ ...polling, polling: { answers: a } });
    setEditIndex(5);
  };

  //to remove the option
  const handleRemove = (i: number) => {
    const a = polling.polling.answers.filter((a, index) => index !== i);
    setPolling({ ...polling, polling: { answers: a } });
  };

  //to add more options to the polling question
  const handleAddoptions = useCallback(() => {
    setPolling({
      ...polling,
      polling: { answers: [option, ...polling.polling.answers] },
    });
    if (polling.polling.answers.length >= 3) {
      setAdd(false);
      return;
    }
  }, [option, polling]);

  //to delete the entire assignment
   const handleDelete = useCallback(async () => {
    await deleteAssignment();
  }, [deleteAssignment]);


  const items: MenuProps['items'] = useMemo(() => [
    {
      key: '1',
      label: (
        <p onClick={handleDelete}>
          <span className="text text-[#3b6a87] my-2">
            <DeleteOutlineIcon className="text-lg" /> Delete
          </span>
        </p>
      ),
    },
    {
      type: ["Assignment", "Material", "Quiz","Polling"].includes(material.assignmentType) ? '' : 'item',
      key: '2',
      label: (
        <p
          className={`text text-[#3b6a87] my-2 ${ !["Assignment", "Material", "Quiz","Polling"].includes(material.assignmentType) && "hidden"}`}
          onClick={
            ["Assignment", "Material", "Quiz"].includes(material.assignmentType)
              ? () => {
                  navigation.push(
                    material.assignmentType === "Quiz"
                      ? `/classroom/editAssignment/quiz?assignment=${material._id}&classroom=${id}`
                      : `/classroom/editAssignment?assignment=${material._id}&classroom=${id}`
                  );
                }
              : () => handleEdit()
          }
        >
          <AutoFixNormalIcon className="text-lg" />
          <span> Edit </span>
        </p>
      ),
    },
  ], [handleDelete, handleEdit, material.assignmentType, material._id, navigation, id]);
 
  return (
    <div>
      <div className="my-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-11 w-11 rounded-full flex bg-[#3b6a87] justify-center items-center">
          <div
                          className={`w-12 h-12 rounded-full flex justify-center items-center`}
                          style={{ backgroundColor: text[1] }}
                        >
                          {material.assignmentType === "Announcement" && (
                            <NewReleasesIcon className="text-white text-xl" />
                          )}
                          {material.assignmentType === "Question" && (
                            <LiveHelpOutlinedIcon className="text-white text-xl" />
                          )}
                          {material.assignmentType === "Assignment" && (
                            <AssignmentIcon className="text-white text-xl" />
                          )}

                          {material.assignmentType === "Material" && (
                            <MenuBookOutlinedIcon className="text-white text-xl" />
                          )}
                          {material.assignmentType === "Polling" && (
                            <PollIcon className="text-white text-xl" />
                          )}
                          {material.assignmentType === "Quiz" && (
                            <QuizIcon className="text-white text-xl" />
                          )}
                        </div>
          </div>
          {material.assignmentType === "Announcement" ? (
            <div>
              <p className="mx-3 text">Announcment : {material.title}</p>
              <p className="text-xs text-slate-400 text mx-4">
                {format(material.createdAt)}
              </p>
            </div>
          ) : (
            <div>
              <p
                className="mx-3 text cursor-pointer"
                onClick={() =>
                  navigation.push(
                    `/classroom/submission?assignment=${material._id}&type=${material.assignmentType}`
                  )
                }
              >
                {material.assignmentType}  has been assigned{" "}
                <span className="text-xs text-slate-400">
                  ({material.title})
                </span>
              </p>
              <p className="text-xs text-slate-400 text mx-4 ">
                {format(material.createdAt)}
              </p>
            </div>
          )}
        </div>

        <Dropdown menu={{ items }} placement="bottomLeft" trigger={["click"]}>
          <MoreVertOutlinedIcon className="m-1 text-slate-700 cursor-pointer" />
        </Dropdown>
      </div>
      <Modal
        title={
          <span className="text font-normal text-[#3b6a87]">Edit Polling</span>
        }
        open={open}
        footer={null}
        onCancel={() => setopen(false)}
      >
        <div className="border-2 rounded-md flex items-center">
          <input
            type="text"
            defaultValue={
              useFormattedCreator(polling.title)
            }
            className="p-2 focus:outline-none rounded-md w-full"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPolling({ ...polling, title: e.target.value })
            }
          />
          <AddIcon
            className="m-1 text-slate-400 cursor-pointer"
            onClick={() => {
              if (polling.polling.answers.length >= 4) {
                message.error("Maximum four options");
                return;
              }
              setAdd(true);
            }}
          />
        </div>
        {add && (
          <div className="mt-8 flex items-center w-full border-b-2 text border-slate-500">
            <input
              type="text"
              placeholder={`Option`}
              className=" w-full text focus:outline-none"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setOption(e.target.value)
              }
            />
            <button
              className="text text-[#3b6a87]  p-1"
              onClick={handleAddoptions}
            >
              Add
            </button>
          </div>
        )}
        <div className="mt-5">
          {!loading ? (
            polling.polling.answers.map((m, index) => {
              return (
                <>
                  <div className="my-3 flex items-center w-full">
                    <div className="my-3 flex items-center w-full">
                      <p className="text">{options[index]} .</p>
                      {editIndex !== index ? (
                        <p className="text w-10/12">
                          {
                            useFormattedCreator(m)
                          }
                        </p>
                      ) : (
                        <input
                          type="text"
                          className="focus:outline-none"
                          defaultValue={
                            useFormattedCreator(m)
                          }
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setText(e.target.value)
                          }
                          autoFocus
                        />
                      )}
                    </div>
                    {editIndex !== index ? (
                      <>
                        <ModeEditOutlineOutlinedIcon
                          className="m-1 text-slate-400 cursor-pointer"
                          onClick={() => {
                            setEditIndex(index);
                          }}
                        />
                        <ClearIcon
                          className="m-1 text-slate-400 cursor-pointer"
                          onClick={() => handleRemove(index)}
                        />
                      </>
                    ) : (
                      <DoneOutlined
                        className="m-1 text-slate-400 cursor-pointer"
                        onClick={() => handlEditOptions(index)}
                      />
                    )}
                  </div>
                  <hr />
                </>
              );
            })
          ) : (
            <div className="flex justify-center">
              <CircularProgress className="text-[#3b6a87]" />
            </div>
          )}
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              className="text-white p-2 border-2 bg-[#3b6a87] rounded-md px-4 text "
              onClick={updatePolling}
            >
              Update
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Material;
