"use client";
import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Image from "next/image";
import { useNavDispatch } from "@/hook/useNavDispatch";

function Header() {
  const { navigation } = useNavDispatch();
  return (
    <div>
      <div className="md:flex items-center min-h-[18rem] mt-7">
        <div className="md:w-7/12">
          <p className=" heading font-semibold mt-9 text-[72px] lg:text-[80px] ml-5 md:ml-8 xm:ml-16 lg:ml-20 text-[#194866]  ">
            Online learning ,<br /> delivered your way
          </p>
        </div>
        <div className="md:w-1/3 ml-5 pr-16 md:pr-8 xm:pr-16 mt-16 md:mt-0 xm:mt-16">
          <p className="text-[#194866] ">
            Join hundreds of thousands of educators and trainers on Moodle, the
            world’s most customisable and trusted learning management system.
          </p>
          <p
            className="mt-4 p-3 px-4 border-2 inline-block rounded-full border-[#194866] text-[#194866] cursor-pointer"
            onClick={() => navigation.push("/signup")}
          >
            Get Started <ArrowForwardIcon className="text-[#194866]" />
          </p>
        </div>
      </div>
      <div className="bg-[#194866] my-32 xm:min-h-[35rem] xl:h-screen relative">
        <div className="absolute h-1/2 w-1/3 bg-slate-300 z-0 hidden lg:block"></div>
        <div className="absolute top-16 left-11 z-50">
          <Image
            src={"/header.jpeg"}
            width={600}
            height={600}
            alt="signup"
            className="rounded-md hidden lg:block xl:hidden"
          />
          <Image
            src={"/header2.jpeg"}
            width={800}
            height={800}
            alt="signup"
            className="rounded-md hidden xl:block"
          />
        </div>
        <div className="flex lg:justify-end items-center relative" id="about">
          <div className=" mt-7 lg:mt-32 mx-3 md:mx-8 ">
            <p className=" text-white">Why Digital Campus?</p>
            <p className="heading font-semibold text-[50px]  xl:text-[55px]  xl:mr-7 text-white">
              Digital Campus puts the
              <br /> power of eLearning
              <br /> in your hands
            </p>
            <p className=" text text-white mt-12">
              At Digital Campus, our mission is to empower educators
              <br /> to improve our world with our open source eLearning
              software.
            </p>
            <p className=" text text-white xl:mr-6 mt-8 mb-5">
              Flexible, secure, and customisable for any online teaching or
              training initiative,
              <br /> Digital Campus gives you the freedom to create an eLearning
              platform
              <br /> that best meets your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
