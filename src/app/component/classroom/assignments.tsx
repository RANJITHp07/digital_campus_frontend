"use client";
import React, { useState, ChangeEvent, Suspense } from "react";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import LiveHelpOutlinedIcon from "@mui/icons-material/LiveHelpOutlined";
import { Modal, message } from "antd";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import PollIcon from "@mui/icons-material/Poll";
import GroupsIcon from "@mui/icons-material/Groups";
import DoneIcon from "@mui/icons-material/Done";
import { themeColor, themeText } from "@/services/data/themeData";
import { FETCH_CLASSROOM_DETAILS } from "@/apis/classroom/query";
import { useMutation, useQuery } from "@apollo/client";
import LoadinPage from "../common/loadinPage";
import { format } from "timeago.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../services/config/firebase";
import { v4 } from "uuid";
import { changeToCreator } from "@/redux/features/classroom-slice/reducer";
import { FETCH_ASSIGNMENT_DETAILS } from "@/apis/assignment/query";
import { assignmentClient } from "@/app/providers/ApolloProvider";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import AssignmentIcon from "@mui/icons-material/Assignment";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import ShareIcon from "@mui/icons-material/Share";
import {
  EmailIcon,
  EmailShareButton,
  TelegramIcon,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { useNavDispatch } from "@/hook/useNavDispatch";
import { UPDATE_CLASS } from "@/apis/classroom/mutation";
import { CREATE_ASSIGNMENT } from "@/apis/assignment/mutation";

function Assignment({ id }: { id: string }) {
  const { dispatch, appSelector } = useNavDispatch();
  const assign = appSelector((state) => state.classroomReducer.creator);
  const token = appSelector((state) => state.authReducer.token);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string[]>(["color: #3b6a87;", "#3b6a87"]);
  const [color, setColor] = useState<any>(themeColor); // choosing theme color
  const [detail, setdetail] = useState(false); // detail of the classroom
  const [share, setshare] = useState(false); // to open and close sharing model
  const [open, setopen] = useState(false);
  const [bg, setbg] = useState("/bg4.png");
  const [modal, setmodal] = useState(false);
  const [background, setbackground] = useState("");
  const [annocument, setannouncment] = useState("");

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <p onClick={handleBlock}>
          <DoDisturbIcon className="text-sm" /> Stop entry
        </p>
      ),
    },
    {
      key: "3",
      label: (
        <p onClick={handleCopyClick}>
          <ContentCopyOutlinedIcon className="text-sm" /> Copy the code
        </p>
      ),
    },
    {
      key: "4",
      label: (
        <p onClick={() => setshare(true)}>
          <ShareIcon className="text-sm" /> Share the code
        </p>
      ),
    },
  ];

  const { loading, data } = useQuery(FETCH_CLASSROOM_DETAILS, {
    variables: { id: id },
    onCompleted: (data) => {
      dispatch(
        changeToCreator(data.getClassroomDetails.admins.includes(token.id))
      );
      setbackground(data.getClassroomDetails.backgroundPicture);
      setbg(data.getClassroomDetails.backgroundPicture);
      const themeColorKey = data.getClassroomDetails
        .themeColor as keyof typeof themeText;
      const textColorClass = themeText[themeColorKey];
      setText([textColorClass, themeColorKey]);
    },
  });

  const { data: allAssignment } = useQuery(FETCH_ASSIGNMENT_DETAILS, {
    client: assignmentClient,
    variables: { id: id },
  });

  const [createAssignment] = useMutation(CREATE_ASSIGNMENT, {
    client: assignmentClient,
    refetchQueries: [
      { query: FETCH_ASSIGNMENT_DETAILS, variables: { id: id } },
    ],
    onError(err) {
      console.log(err);
      message.info("Some error");
    },
    onCompleted: () => {
      setannouncment("");
      message.info("Announcment made sucessfully");
    },
  });

  const handleClick = async () => {
    const assignment = {
      title: annocument,
      class_id: [id],
      students: data.getClassroomDetails.students_enrolled,
      assignmentType: "Announcement",
      creator: token.name,
    };
    console.log(data.getClassroomDetails);
    await createAssignment({
      variables: {
        assignment: assignment,
      },
    });
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleClick();
      setannouncment("");
    }
  };

  //to update the classroom
  const [updateClass] = useMutation(UPDATE_CLASS, {
    onError(err) {
      console.log(err);
      message.info("Some error occured");
    },
    onCompleted() {
      setopen(false);
    },
  });

  //to block the students from entering the
  async function handleBlock() {
    await updateClass({
      variables: {
        id: id,
        update: {
          block: true,
        },
      },
    });
  }

  //to save the updates
  const handleSave = async () => {
    try {
      if (file) {
        const imageRef = ref(storage, `images/${file.name + v4()}`);
        uploadBytes(imageRef, file).then((snapshot) => {
          getDownloadURL(snapshot.ref).then(async (url) => {
            setbackground(url);
            await updateClass({
              variables: {
                id: id,
                update: { backgroundPicture: url, themeColor: text[1] },
              },
            });
          });
        });
      } else {
        setbackground(bg);
        await updateClass({
          variables: {
            id: id,
            update: { backgroundPicture: bg, themeColor: text[1] },
          },
        });
      }
    } catch (err: any) {
      message.info(err);
    }
  };

  //to handle the theme selection
  const handleDivClick = (c: string) => {
    const updatedThemeColor = Object.fromEntries(
      Object.entries(color).map(([key]) => [key, key === c])
    );
    const colorText = (themeText as any)[c] as string;
    setText([colorText, c]);
    setColor(updatedThemeColor);
  };

  function handleCopyClick() {
    navigator.clipboard
      .writeText(data.getClassroomDetails.classCode)
      .then(() => {
        message.info("Copied successfully");
      })
      .catch((err) => {
        console.error("Unable to copy text to clipboard:", err);
      });
  }

  return (
    <div className="xl:mx-24 lg:mx-24 xm:mx-12 md:mx-6 mx-5 h-min-screen">
      {loading ? (
        <LoadinPage />
      ) : (
        <>
          <div
            className={`bg-cover  bg-right h-100 mt-9 w-full h-60 box_shadow  ${
              !detail ? "rounded-lg my-9" : "rounded-t-lg"
            } relative`}
            style={{
              backgroundImage: `url( ${background})`,
            }}
          >
            <div className="flex justify-end">
              {assign && (
                <button
                  className="bg-white box_shadow p-2 px-3 text-center m-3 rounded-md text-sm text text-[#3b6a127]"
                  onClick={() => setopen(true)}
                >
                  <ModeEditOutlinedIcon className="text-md text-[#3b6a127]" />{" "}
                  Customize
                </button>
              )}
            </div>
            <div className="text-white  mx-4 w-full items-center flex justify-between absolute bottom-0">
              <div className="mb-3">
                <p className="font-medium text-3xl text-white">
                  {data &&
                    data.getClassroomDetails.className[0].toUpperCase() +
                      data.getClassroomDetails.className
                        .slice(1, data.getClassroomDetails.className.length)
                        .toLowerCase()}
                </p>
                <p className="text-sm text">
                  By{" "}
                  {data &&
                    data.getClassroomDetails.creator[0].toUpperCase() +
                      data.getClassroomDetails.creator
                        .slice(1, data.getClassroomDetails.creator.length)
                        .toLowerCase()}
                </p>
              </div>
              <InfoOutlinedIcon
                className="mx-7 cursor-pointer"
                onClick={() => setdetail(!detail)}
              />
            </div>
          </div>
          {detail && (
            <div
              className={`bg-white box_shadow  rounded-b-lg mb-9 p-5 text`}
              style={{ color: text[1] }}
            >
              <p>
                {" "}
                Name of the classroom : {
                  data.getClassroomDetails.className
                }{" "}
              </p>
              <p>
                {" "}
                Classcode : {data.getClassroomDetails.classCode}{" "}
                <ContentCopyOutlinedIcon className="text-xs cursor-pointer" />
              </p>
              <p>
                No of students enrolled :{" "}
                {data.getClassroomDetails.students_enrolled.length}{" "}
                <GroupsIcon className="text-sm" />
              </p>
            </div>
          )}
          <div className="md:flex my-5">
            <div className="box_shadow   rounded-md w-36 h-24 hidden md:block">
              <div
                className="flex justify-between w-full"
                style={{ color: text[1] }}
              >
                <p className={`text-xs mr-6 m-2 ${text[0]} `}>Class code</p>
                <Dropdown menu={{ items }} placement="bottomLeft">
                  <MoreVertOutlinedIcon className={`m-1 ${text[0]} `} />
                </Dropdown>
              </div>
              <p
                className={` text-2xl xl:text-3xl xl:my-3 font-semibold text m-2 ml-4`}
                style={{ color: text[1] }}
              >
                {data.getClassroomDetails.classCode}{" "}
                <ContentCopyOutlinedIcon
                  className={`text-sm cursor-pointer ${text}`}
                  onClick={handleCopyClick}
                />
              </p>
            </div>
            <div className="w-full md:ml-6">
              <div className="box_shadow p-4 rounded-md h-24">
                <p className={` text-xs mx-1`} style={{ color: text[1] }}>
                  Announcment for all the participants in classroom
                </p>
                <input
                  id="message"
                  type="text"
                  placeholder="Message.."
                  className=" block w-full p-3 md:p-2 lg:p-3 border-2 border-gray-100 rounded-md shadow-sm focus:outline-none   text text-slate-500"
                  value={annocument}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setannouncment(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                />
              </div>

              {allAssignment &&
                allAssignment.getAllassignment.map((m: any) => {
                  return (
                    <div className="border-2 flex my-12 p-4 rounded-lg bg-white">
                      <div className="w-24 flex justify-center items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex justify-center items-center`}
                          style={{ backgroundColor: text[1] }}
                        >
                          {m.assignmentType === "Announcement" && (
                            <NewReleasesIcon className="text-white text-xl" />
                          )}
                          {m.assignmentType === "Question" && (
                            <LiveHelpOutlinedIcon className="text-white text-xl" />
                          )}
                          {m.assignmentType === "Assignment" && (
                            <AssignmentIcon className="text-white text-xl" />
                          )}

                          {m.assignmentType === "Material" && (
                            <MenuBookOutlinedIcon className="text-white text-xl" />
                          )}
                          {m.assignmentType === "Polling" && (
                            <PollIcon className="text-white text-xl" />
                          )}
                        </div>
                      </div>
                      <div className="w-full flex justify-between items-center">
                        <div>
                          {m.assignmentType === "Announcement" ? (
                            <>
                              <p className={`text ${text[0]}`}>
                                Announcment from{" "}
                                {data.getClassroomDetails.creator} :
                              </p>
                              <p className="text text-slate-500">{m.title}</p>
                            </>
                          ) : (
                            <p className={`text ${text[0]}`}>
                              {data.getClassroomDetails.creator} posted a{" "}
                              {m.assignmentType}
                            </p>
                          )}

                          <p className="text text-xs text-slate-500">
                            {format(m.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <Modal
            title={
              <span className="text font-normal text-[#3b6a87]">
                Customize apperance
              </span>
            }
            open={open}
            footer={null}
            onCancel={() => setopen(false)}
            width={1000}
          >
            {file ? (
              <div
                className=" bg-cover bg-right h-100 my-9 w- h-60 box_shadow rounded-lg relative"
                style={{
                  backgroundImage: `url(${file && URL.createObjectURL(file)})`,
                }}
              ></div>
            ) : (
              <div
                className="bg-cover bg-right h-100 my-9 w- h-60 box_shadow rounded-lg relative"
                style={{
                  backgroundImage: `url(${bg})`,
                }}
              ></div>
            )}

            <div className="flex justify-between items-center my-6 mb-12">
              <div className="hidden md:block">
                <p className="text">Select header image</p>
              </div>
              <div className="md:mx-0">
                <button
                  className=" px-2 md:px-4 py-2 text rounded-md mx-2 md:mx-3 bg-slate-300 xm:bg-slate-100"
                  onClick={() => setmodal(true)}
                >
                  <InsertPhotoOutlinedIcon /> Select Photo
                </button>
                <Suspense fallback={loading}>
                  <Modal
                    open={modal}
                    footer={null}
                    onCancel={() => setmodal(false)}
                    width={1000}
                  >
                    <div
                      className=" cursor-pointer bg-cover bg-right h-100 my-9 w- h-60 box_shadow rounded-lg relative"
                      onClick={() => {
                        setbg("/bg2.png");
                        setmodal(false);
                      }}
                      style={{
                        backgroundImage: `url('/bg2.png')`,
                      }}
                    ></div>
                    <div
                      className=" cursor-pointer bg-cover bg-right h-100 my-9 w- h-60 box_shadow rounded-lg relative"
                      onClick={() => {
                        setbg("/bg3.png");
                        setmodal(false);
                      }}
                      style={{
                        backgroundImage: `url('/bg3.png')`,
                      }}
                    ></div>
                    <div
                      className=" cursor-pointer bg-cover bg-right h-100 my-9 w- h-60 box_shadow rounded-lg relative"
                      onClick={() => {
                        setbg("/bg4.png");
                        setmodal(false);
                      }}
                      style={{
                        backgroundImage: `url('/bg4.png')`,
                      }}
                    ></div>
                    <div
                      className=" cursor-pointer bg-cover bg-right h-100 my-9 w- h-60 box_shadow rounded-lg relative"
                      onClick={() => {
                        setbg("/bg5.png");
                        setmodal(false);
                      }}
                      style={{
                        backgroundImage: `url('/bg5.png')`,
                      }}
                    ></div>
                  </Modal>
                </Suspense>
                <label
                  htmlFor="file"
                  className=" px-2 md:px-4 py-3 text rounded-md cursor-pointer bg-slate-300 xm:bg-slate-100"
                >
                  <FileUploadOutlinedIcon /> Upload Photo
                </label>
                <input
                  type="file"
                  name="file"
                  id="file"
                  className="hidden"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    e.target.files && setFile(e.target.files[0])
                  }
                />
              </div>
            </div>
            <div className="flex justify-between">
              {Object.keys(color).map((c) => (
                <div
                  key={c}
                  className={`w-16 h-16 md:w-24 md:h-24 rounded-full text-white flex justify-center items-center cursor-pointer ${
                    c === "#ef4444" || c === "#10b981" ? "hidden md:flex" : ""
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => handleDivClick(c)}
                >
                  {color[c] && <DoneIcon className="md:text-5xl" />}
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end">
              <button
                className="bg-slate-300 px-4 py-2 text rounded-md mx-3 "
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </Modal>
        </>
      )}
      <Modal
        title={<span className="text font-normal">Share</span>}
        open={share}
        footer={null}
        onCancel={() => setshare(false)}
      >
        <div className="flex justify-center mb-6">
          <WhatsappShareButton
            title={
              data &&
              `Classroom code of ${
                data && data.getClassroomDetails.className
              } is \n`
            }
            url={data && data.getClassroomDetails.classCode}
          >
            <WhatsappIcon size={44} round={true} />
            <p className="text-xs text-center">Whatsapp</p>
          </WhatsappShareButton>
          <TelegramShareButton
            title={`Classroom code of ${
              data && data.getClassroomDetails.className
            } is \n`}
            url={data && data.getClassroomDetails.classCode}
          >
            <TelegramIcon size={44} round={true} className="mx-12" />
            <p className="text-xs text-center">Telegram</p>
          </TelegramShareButton>
          <EmailShareButton
            title={`Classroom code of ${
              data && data.getClassroomDetails.className
            } is \n`}
            url={data && data.getClassroomDetails.classCode}
          >
            <EmailIcon size={44} round={true} />
            <p className="text-xs text-center">Email</p>
          </EmailShareButton>
        </div>
      </Modal>
    </div>
  );
}

export default Assignment;
