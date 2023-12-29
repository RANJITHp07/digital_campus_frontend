"use client";
import React, { useState} from "react";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupIcon from "@mui/icons-material/Group";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LogoutIcon from "@mui/icons-material/Logout";
import { getCategory} from "@/redux/features/classroom-slice/reducer";
import {
  FETCH_ADDED_CLASSROOM_QUERY,
  FETCH_CLASSROOM_QUERY,
} from "@/apis/classroom";
import { useQuery } from "@apollo/client";
import CategoryIcon from "@mui/icons-material/Category";
import { ClassroomProps } from "@/@types/classroom";
import { useNavDispatch } from "@/hook/useNavDispatch";
import useLogout from "@/hook/uselogout";
import useNavigation from "@/hook/useNavigation";

function SidePanel() {
  const logout=useLogout()
  const useNavigate=useNavigation()
  const {dispatch,appSelector}=useNavDispatch()
  const state = appSelector((state) => state.classroomReducer.open); //to open and close the sidepanel
  const checked = appSelector((state) => state.classroomReducer.category);
  const token = appSelector((state) => state.authReducer.token);
  const [teaching, setteaching] = useState(false);
  const [enrolled, setenrolled] = useState(false);
  const [category, setcategory] = useState(false);
  const { data } = useQuery(FETCH_CLASSROOM_QUERY, {
    variables: { id: token.id },
  });
  const { data: addedClasroom } = useQuery(FETCH_ADDED_CLASSROOM_QUERY, {
    variables: { id: token.id },
  });

  //handle the category checkbox
  const handleCheckbox = (category: string) => {
    dispatch(getCategory(category));
  };

  return (
    <div className={`bg-white py-5 ${state && "w-56"}`}>
      <div className={`flex items-center p-1 cursor-pointer hover:bg-slate-200 hover:mr-3 hover:rounded-r-full`}>
        <HomeIcon className="mr-6  text-[#3b6a87] ml-4 " />
        {state && (
          <p
            className=" text-[#3b6a87] text-lg"
            onClick={() =>useNavigate('home')}
          >
            Home
          </p>
        )}
      </div>
      <div className="flex items-center p-1 mt-5 cursor-pointer hover:bg-slate-200 hover:mr-3 hover:rounded-r-full">
        <CalendarMonthIcon className="mr-6  text-[#3b6a87] ml-4" />
        {state && (
          <p
            className=" text-[#3b6a87] text-lg"
            onClick={() =>useNavigate('calendar')}
          >
            Calender
          </p>
        )}
      </div>
      <hr className="mt-3 mb-3" />
      <div
        className={`flex items-center mt-5 cursor-pointer hover:bg-slate-200  hover:rounded-r-full py-1 hover:w-[95%]`}
      >
        <ArrowRightIcon
          className="text-[#3b6a87] "
          onClick={() => setcategory(!category)}
        />
        <CategoryIcon className="mr-6  text-[#3b6a87] " />
        {state && <p className=" text-[#3b6a87] text-lg">Category</p>}
      </div>
      <hr className="mt-3 mb-3" />
      {state && category && (
        <>
          <div className="flex items-center mb-4 cursor-pointer">
            <input
              type="checkbox"
              className={`flex w-4 h-4 cursor-pointer accent-[#3b6a87]  ml-6 rounded-full justify-center items-center text text-white text-xs`}
              checked={checked.includes("Junior level")}
              onClick={() => handleCheckbox("Junior level")}
            />
            <div className="mx-4">
              <p className="text-md text text-[#3b6a87]">Junior level</p>
            </div>
          </div>
          <div className="flex items-center mb-4 cursor-pointer">
            <input
              type="checkbox"
              className={`flex w-4 h-4 cursor-pointer  ml-6 accent-[#3b6a87] rounded-full justify-center items-center text text-white text-xs`}
              checked={checked.includes("Higher secondary")}
              onClick={() => handleCheckbox("Higher secondary")}
            />
            <div className="mx-4">
              <p className="text-md text text-[#3b6a87]">Higher Secondary</p>
            </div>
          </div>
          <div className="flex items-center mb-4 cursor-pointer">
            <input
              type="checkbox"
              className={`flex w-4 h-4 cursor-pointer accent-[#3b6a87] ml-6 rounded-full justify-center items-center text  text-xs`}
              checked={checked.includes("University")}
              onClick={() => handleCheckbox("University")}
            />
            <div className="mx-4">
              <p className="text-md text text-[#3b6a87]">University</p>
            </div>
          </div>
        </>
      )}
      {state && category && <hr className="mt-3 mb-6" />}
      <div
        className={`flex items-center  mt-5 cursor-pointer hover:bg-slate-200  hover:rounded-r-full py-1 hover:w-[95%]`}
      >
        <ArrowRightIcon
          className="text-[#3b6a87] "
          onClick={() => setteaching(!teaching)}
        />
        <GroupIcon className="mr-6  text-[#3b6a87] " />
        {state && (
          <p
            className=" text-[#3b6a87] text-lg"
            onClick={() => useNavigate('teaching')}
          >
            Teaching
          </p>
        )}
      </div>
      {teaching && state && (
        <>
          <hr className="my-3" />
          <div className="mb-6">
            {data &&
              data.getCreatorClassroom.map((c: ClassroomProps) => {
                return (
                  <div
                    className="flex items-center mb-4 cursor-pointer"
                    key={c._id}
                  >
                    <div
                      className={`flex w-7 h-7  ml-6 rounded-full justify-center items-center text text-white text-xs`}
                      style={{backgroundColor: c.themeColor}}
                    >
                       { c.className && c.className[0].toUpperCase()}
                    </div>
                    <div className="mx-4">
                      <p className="text-sm text text-[#3b6a87]">
                        {c.className}
                      </p>
                      <p className="text-xs font-sm text text-slate-500">
                        {c.classSection}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
      <hr className="mt-3 mb-6" />
      <div
        className={`flex items-center mt-5 cursor-pointer hover:bg-slate-200  hover:rounded-r-full py-1 hover:w-[95%]`}
      >
        <ArrowRightIcon
          className="text-[#3b6a87] "
          onClick={() => setenrolled(!enrolled)}
        />
        <SchoolIcon className="mr-6  text-[#3b6a87] " />
        {state && (
          <p
            className=" text-[#3b6a87] text-lg"
            onClick={() => useNavigate('enrolled')}
          >
            Enrolled
          </p>
        )}
      </div>
      {enrolled && state && (
        <>
          <hr className="my-3" />
          <div className="mb-6">
            {addedClasroom &&
              addedClasroom.getAllClassroom.map((c: ClassroomProps) => {
                return (
                  <div
                    className="flex items-center mb-4 cursor-pointer"
                    key={c._id}
                  >
                    <div
                      className={`flex w-7 h-7  ml-6 rounded-full justify-center items-center text text-white text-xs`}
                      style={{backgroundColor: c.themeColor}}
                    >
                      { c.className && c.className[0].toUpperCase()}
                    </div>
                    <div className="mx-4">
                      <p className="text-sm text text-[#3b6a87]">
                        {c.className}
                      </p>
                      <p className="text-xs font-sm text text-slate-500">
                        {c.classSection}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
      <hr className="mt-3 mb-6" />
      <div className="flex items-center p-1 mt-5 cursor-pointer hover:bg-slate-200 hover:mr-3 hover:rounded-r-full">
        <AssignmentIndIcon className="mr-6  text-[#3b6a87] ml-4" />
        {state && (
          <p
            className=" text-[#3b6a87] text-lg"
            onClick={() => useNavigate('profile')}
          >
            Profile
          </p>
        )}
      </div>
      <div
        className="flex items-center p-1 mt-5 cursor-pointer hover:bg-slate-200 hover:mr-3 hover:rounded-r-full"
        onClick={logout}
      >
        <LogoutIcon className="mr-6  text-[#3b6a87] ml-4" />
        {state && <p className=" text-[#3b6a87] text-lg">Logout</p>}
      </div>
      <hr className="mt-3 mb-6" />
    </div>
  );
}

export default SidePanel;
