"use client";
import React, {
  ChangeEvent,
  Suspense,
  useCallback,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { MenuProps } from "antd";
import { Dropdown, Modal, Tooltip, message } from "antd";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import {
  FETCH_ADDED_CLASSROOM_QUERY,
  FETCH_ALL_CLASSROOM_QUERY,
  FETCH_CLASSROOM_QUERY,
} from "@/apis/classroom/query";
import { useMutation } from "@apollo/client";
import { useNavDispatch } from "@/hook/useNavDispatch";
import { ClassProps } from "@/@types/classroom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonRemoveAlt1 from "@mui/icons-material/PersonRemoveAlt1";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import EditIcon from "@mui/icons-material/Edit";
import { changeAssignment } from "@/redux/features/classroom-slice/reducer";
import {
  DELETE_CLASS,
  REMOVE_STUDENT,
  UPDATE_CLASSROOM_DETAILS,
} from "@/apis/classroom/mutation";
import useFormattedCreator from "@/hook/useFormat";

function Class({
  className,
  creator,
  id,
  classCode:code,
  type,
  bg,
  classSubject:subject,
  classSection:section,
  profile,
  block,
}: ClassProps) {
  const { navigation, appSelector, dispatch } = useNavDispatch();
  const token = appSelector((state) => state.authReducer.token);
  const [report, setReport] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [classroom, setClassroom] = useState({
    className: className,
    classSection: section,
    classSubject: subject,
    profile: profile,
  });

  //items of the class menu
  const items: MenuProps["items"] = useMemo(
    () => [
      {
        key: "1",
        label: (
          <p
            className="text-[#3b6a87] "
            onClick={!type ? removeStudent : deleteClass}
          >
            {!type ? (
              <span>
                <PersonRemoveAlt1 className="text-sm" /> Unenroll
              </span>
            ) : (
              <span>
                <DeleteOutlineIcon className="text-sm" /> Delete
              </span>
            )}
          </p>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "3",
        label: (
          <p
            className="text-[#3b6a87]"
            onClick={type ? handleEdit : () => setReport(true)}
          >
            {type ? (
              <span>
                <EditIcon className="text-sm" /> Edit
              </span>
            ) : (
              <span>
                <ReportGmailerrorredIcon className="text-sm" /> Report Abuse
              </span>
            )}
          </p>
        ),
      },
    ],
    [type, removeStudent, deleteClass, handleEdit, setReport]
  );

  //setOpen
  async function handleEdit() {
    setOpen(true);
  }

  //to remove student query
  const [remove_student] = useMutation(REMOVE_STUDENT, {
    onError(err) {
      console.log(err);
      console.log(code, token.id);
    },
    variables: {
      userId: token.id,
      code: code,
    },
    refetchQueries: [
      { query: FETCH_ADDED_CLASSROOM_QUERY, variables: { id: token.id } },
      { query: FETCH_ALL_CLASSROOM_QUERY, variables: { id: token.id } },
    ],
    onCompleted: () => {
      message.info("Existed from the classroom");
    },
  });

  async function removeStudent() {
    try {
      await remove_student();
    } catch (err) {
      throw err;
    }
  }

  //to delete class
  const [delete_class] = useMutation(DELETE_CLASS, {
    onError(err) {
      message.info("Some error occured");
    },
    variables: {
      id: id,
    },
    refetchQueries: [
      { query: FETCH_CLASSROOM_QUERY, variables: { id: token.id } },
      { query: FETCH_ALL_CLASSROOM_QUERY, variables: { id: token.id } },
    ],
    onCompleted: () => {
      message.info("Class is deleted successfully");
    },
  });

  async function deleteClass() {
    try {
      await delete_class();
    } catch (err) {
      throw err;
    }
  }

  //to update the classroom
  const [updateClassroom] = useMutation(UPDATE_CLASSROOM_DETAILS, {
    onError(err) {
      console.log(err);
    },
    onCompleted: () => {
      setOpen(false);
      message.info("Submitted");
    },
  });

  const handleUpdate = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { profile, ...updatedClassroom } = classroom;
      updateClassroom({
        variables: {
          id: id,
          update: updatedClassroom,
        },
      });
    },
    [classroom, id, updateClassroom]
  );

  const handleReport = useCallback(async () => {
    const update = {
      reported: true,
      reason: {
        title: title,
        description: description,
        reporter: token.name,
      },
    };
    await updateClassroom({
      variables: {
        id: id,
        update: update,
      },
    });

    setReport(false);
    setTitle("");
    setDescription("");
  }, [id, title, description, token.name, updateClassroom]);

  return (
    <div className="w-72 box_shadow rounded-lg mx-auto md:mx-5 lg:mx-8 h-72 my-8 relative cursor-pointer">
      <div
        className="w-full h-1/2 bg-cover bg-transparent bg-right  relative rounded-t-lg py-2 px-1"
        style={{
          backgroundImage: `url(${bg})`,
        }}
      >
        <div className="flex justify-end  cursor-pointer">
          <Dropdown menu={{ items }} placement="bottomLeft">
            <MoreVertIcon className="text-white" />
          </Dropdown>
        </div>
        <div
          className="absolute top-16 left-5 w-full"
          onClick={
            block
              ? () => message.info("Blocked the classroom by admin")
              : () => navigation.push(`/classroom/${id}?code=${code}`)
          }
        >
          <Image
            src={profile === "" ? "/profile-logo.jpg" : profile as string}
            width={profile === "" ? 120 : 140}
            height={profile === "" ? 120 : 140}
            alt="profile"
            className="rounded-full z-50 	"
          />
        </div>
      </div>
      <div
        className="flex justify-end mx-2 "
        onClick={
          block
            ? () => message.info("Blocked the classroom by admin")
            : () => navigation.push(`/classroom/${id}?code=${code}`)
        }
      >
        <div  className="">
          <p>
            {classroom.className && ( classroom.className.length>20 ? useFormattedCreator(classroom.className).slice(0,12)+ '...' : useFormattedCreator(classroom.className) )}
          </p>
          <p className="text-xs ">{creator}</p>
        </div>
      </div>
      <div className="absolute bottom-0 w-full">
        <hr />
        <div className="flex justify-end m-3">
          <Tooltip placement="topRight" title={"see all the participants"}>
            <AssignmentIndIcon
              className="text-[#8cb6d0] text-2xl mx-2 cursor-pointer"
              onClick={() => {
                navigation.push(`/classroom/${id}?code=${code}`);
                dispatch(changeAssignment("people"));
              }}
            />
          </Tooltip>
          <Tooltip placement="topLeft" title={"see all the assignments"}>
            <AssignmentIcon
              className="text-[#8cb6d0] text-2xl cursor-pointer"
              onClick={() => {
                navigation.push(`/classroom/${id}?code=${code}`);
                dispatch(changeAssignment("classwork"));
              }}
            />
          </Tooltip>
        </div>
      </div>
      <Suspense fallback={<div>loading...</div>}>
        <Modal
          title={<span className="text font-normal">Update classroom</span>}
          open={open}
          footer={null}
          onCancel={() => setOpen(false)}
        >
          <form className="mt-5" onSubmit={handleUpdate}>
            <input
              type="text"
              className=" w-full p-2 rounded-md focus:outline-none border-slate-300 border-2 my-2 text text-slate-500"
              placeholder="Class name(max 20 character)"
              defaultValue={classroom.className}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setClassroom({ ...classroom, className: e.target.value })
              }
            />
            <input
              type="text"
              className=" w-full p-2 rounded-md focus:outline-none border-slate-300   border-2 my-2 text text-slate-500"
              placeholder="Class section"
              defaultValue={classroom.classSection}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setClassroom({ ...classroom, classSubject: e.target.value })
              }
            />
            <input
              type="text"
              className=" w-full p-2 rounded-md focus:outline-none  border-slate-300  border-2 my-2 text text-slate-500"
              placeholder="Class subject"
              defaultValue={classroom.classSubject}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setClassroom({ ...classroom, classSection: e.target.value })
              }
            />
            <div className="flex justify-end my-2">
              <button
                type="submit"
                className="bg-slate-300 p-2 border-2 text-slate-700 rounded-md px-4 text "
              >
                Update
              </button>
            </div>
          </form>
        </Modal>
        <Modal
          title={<span className="text font-normal">Report classroom</span>}
          open={report}
          footer={null}
          onCancel={() => {
            setReport(false);
            setTitle("");
            setDescription("");
          }}
        >
          <select
            className="w-full p-3 rounded-md border-2 text-md focus:outline-none border-slate-300"
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setTitle(e.target.value)
            }
          >
            <option value="improperContents">Inappropriate Contents</option>
            <option value="hateSpeech">Hate Speech</option>
            <option value="harassment">Harassment</option>
            <option value="violence">Violence or Threats</option>
          </select>
          <textarea
            rows={10}
            cols={10}
            placeholder="Describe the problem the problem"
            className="w-full border-2 focus:outline-none rounded-md border-slate-300 mt-5 p-2"
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
          ></textarea>
          <div className="flex justify-end my-2">
            <button
              type="submit"
              className="bg-slate-300 p-2 border-2 text-slate-700 rounded-md px-4 text "
              onClick={handleReport}
            >
              Submit
            </button>
          </div>
        </Modal>
      </Suspense>
    </div>
  );
}

export default Class;
