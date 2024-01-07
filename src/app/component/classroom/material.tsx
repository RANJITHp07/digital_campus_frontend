"use client";
import AutoFixNormalIcon from "@mui/icons-material/AutoFixNormal";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import React, { ChangeEvent, useState } from "react";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { useRouter } from "next/navigation";
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
import { Polling } from "@/@types/assignment";
import { CircularProgress } from "@mui/material";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DoneOutlined from "@mui/icons-material/DoneOutlined";
import { useAppSelector } from "@/redux/store";

function Material({
  material,
  assignment,
  setassignment,
  id,
}: {
  material: any;
  assignment: any;
  setassignment: React.Dispatch<any>;
  id: string;
}) {
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <p onClick={handleDelete}>
          <span className="text text-[#3b6a87] my-2">
            <DeleteOutlineIcon className="text-lg" /> Delete
          </span>
        </p>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <p
          className="text text-[#3b6a87] my-2"
          onClick={
            ["Assignment", "Material", "Quiz"].includes(material.assignmentType)
              ? () => {
                  router.push(
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
  ];
  let options = ["A", "B", "C", "D"];
  const router = useRouter();
  const [add, setadd] = useState(false);
  const token = useAppSelector((state) => state.authReducer.token);
  const [text, setText] = useState("");
  const [option, setOption] = useState("");
  const [editIndex, setEditIndex] = useState(5);
  const [open, setopen] = useState(false);
  const [polling, setPolling] = useState<Polling>({
    __typename: "",
    title: material.title,
    polling: {
      __typename: "",
      answers: [],
    },
    students: [],
  });
  const [pollingQuery, { loading }] = useLazyQuery(EDIT_POLLING, {
    client: assignmentClient,
    onError(err) {
      console.log(material._id);
      console.log(err);
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
      console.log(err);
    },
    onCompleted: (data) => {
      const { mainTopic, ...newData } = data.deleteAssignment;

      const a = assignment.map((m: any) => {
        if (m._id === mainTopic) {
          console.log(m);
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
      console.log(err);
    },
    onCompleted: () => {
      setopen(false);
    },
  });

  //to update the polling
  const updatePolling = async () => {
    if (polling.title.trim().length === 0) {
      message.error("title is important");
      return;
    }
    const {
      __typename: type,
      students,
      title,
      polling: { __typename, ...p },
    } = polling;
    const a = { title, students, polling: { ...p } };
    const assignment = {
      ...a,
      creator: token.name,
      class_id: [id],
      assignmentType: "Polling",
    };
    console.log(assignment);
    await updateAssignment({
      client: assignmentClient,
      variables: {
        id: material._id,
        update: assignment,
      },
    });
  };

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
  const handleAddoptions = () => {
    setPolling({
      ...polling,
      polling: { answers: [option, ...polling.polling.answers] },
    });
    if (polling.polling.answers.length >= 3) {
      setadd(false);
      return;
    }
  };

  //to delete the entire assignment
  async function handleDelete() {
    await deleteAssignment();
  }
  return (
    <div>
      <div className="my-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-11 w-11 rounded-full flex bg-[#3b6a87] justify-center items-center">
            <ContentPasteIcon className="text-white" />
          </div>
          {material.assignmentType === "Announcement" ? (
            <div>
              <p className="mx-3 text">Announcment : {material.title}</p>
              <p className="text-xs text-slate-400 text">
                {" "}
                {format(material.createAt)}
              </p>
            </div>
          ) : (
            <div>
              <p
                className="mx-3 text cursor-pointer"
                onClick={() =>
                  router.push(
                    `/classroom/submission?assignment=${material._id}&type=${material.assignmentType}`
                  )
                }
              >
                {material.assignmentType} for this chapter{" "}
                <span className="text-xs text-slate-400">
                  ({material.title})
                </span>
              </p>
              <p className="text-xs text-slate-400 text mx-4 ">
                {" "}
                {format(material.createAt)}
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
              polling.title[0].toUpperCase() +
              polling.title.slice(1, polling.title.length).toLocaleLowerCase()
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
              setadd(true);
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
                          {m[0].toUpperCase() +
                            m.slice(1, m.length).toLocaleLowerCase()}
                        </p>
                      ) : (
                        <input
                          type="text"
                          className="focus:outline-none"
                          defaultValue={
                            m[0].toUpperCase() +
                            m.slice(1, polling.title.length).toLocaleLowerCase()
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
