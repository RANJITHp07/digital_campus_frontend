"use client";
import React, { useState } from "react";
import Image from "next/image";
import ListIcon from "@mui/icons-material/List";
import CloseIcon from "@mui/icons-material/Close";
import HouseIcon from "@mui/icons-material/House";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import InfoIcon from "@mui/icons-material/Info";
import Link from "next/link";

function Navbar() {
  const [open, setopen] = useState(false);
  return (
    <>
      <nav className="flex justify-between items-center relative ">
        <Link href="/">
          <Image
            src={"/Logo.png"}
            width={50}
            height={50}
            alt="logo"
            className="m-2 mx-4 cursor-pointer"
          />
        </Link>
        <div className="md:flex hidden">
          <Link
            href="/"
            className="text  text-[#194866] hover:border-b-4 cursor-pointer border-[#194866] rounded"
          >
            Home
          </Link>
          <Link
            href="#about"
            className="mx-5 text text-[#194866]  hover:border-b-4 cursor-pointer border-[#194866] rounded"
          >
            About
          </Link>
          <Link
            href="#services"
            className="text  text-[#194866]  hover:border-b-4 cursor-pointer border-[#194866] rounded"
          >
            Services
          </Link>
        </div>
        <div className="hidden md:block">
          <a
            href="/login"
            className="bg-[#194866] cursor-pointer text-white px-4  py-2 rounded-md mx-3"
          >
            Login
          </a>
        </div>
        <div className="md:hidden">
          <ListIcon
            className="text-3xl mx-3 text-[#194866]"
            onClick={() => setopen(!open)}
          />
        </div>
        {open && (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex  bg-black bg-opacity-50 z-50">
            <div className="h-full w-56 bg-white">
              <div className="flex justify-end m-2">
                <CloseIcon onClick={() => setopen(!open)} />
              </div>
              <div className="my-8">
                <div className="flex items-center hover:bg-slate-100 hover:rounded-r-full hover:mr-7">
                  <HouseIcon className="text-[#194866] text-3xl ml-2" />
                  <Link
                    href="/"
                    className="text-[#194866] mx-4 text-xl text my-2"
                    onClick={() => setopen(!open)}
                  >
                    Home
                  </Link>
                </div>
                <hr className="mb-6 mt-3" />
                <div className="flex items-center hover:bg-slate-100 hover:p-1 hover:rounded-r-full hover:mr-7">
                  <MiscellaneousServicesIcon className="text-[#194866] text-3xl ml-2" />
                  <Link
                    href="#services"
                    className="text-[#194866] mx-4 text-xl text "
                    onClick={() => setopen(!open)}
                  >
                    Services
                  </Link>
                </div>
                <hr className="mb-6 mt-3 " />
                <div className="flex items-center hover:bg-slate-100 hover:p-1 hover:rounded-r-full hover:mr-7">
                  <InfoIcon className="text-[#194866] text-3xl ml-2" />
                  <Link
                    href="#about"
                    className="text-[#194866] mx-4 text-xl text"
                    onClick={() => setopen(!open)}
                  >
                    About
                  </Link>
                </div>
                <hr className="mb-6 mt-3" />
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
