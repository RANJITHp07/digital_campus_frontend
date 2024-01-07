"use client";
import Image from "next/image";
import Form from "../component/signup/form";
import Link from "next/link";
import dynamic from "next/dynamic";
import { setResend } from "@/redux/features/user-auth-slice/reducer";
import { useNavDispatch } from "@/hook/useNavDispatch";

// Use next/dynamic to lazily load the Otp component
const Otp = dynamic(() => import("../component/signup/otp"), { ssr: false });

function Signup() {
  const { dispatch, appSelector } = useNavDispatch();
  const modal: boolean = appSelector((state) => state.userReducer.modal);

  return (
    <div>
      <div className="lg:absolute right-0 m-3 flex justify-end">
        <Link
          href="/login"
          className=" border-2 rounded-md py-1 px-3 text-[#194866] border-[#194866]"
          onClick={() => dispatch(setResend(false))}
        >
          Login
        </Link>
      </div>
      <div className="grid place-content-center xm:h-screen">
        <div className={`  xm:flex  rounded-lg bg-white ${modal && "blur"}`}>
          <div className="xm:flex items-center justify-center rounded-l-lg hidden">
            <Image src={"/signin.jpg"} width={700} height={700} alt="signup" />
          </div>
          <div className="flex items-center justify-center  xm:hidden">
            <Image src={"/signin.jpg"} width={400} height={400} alt="signup" />
          </div>
          <div className="flex lg:items-center justify-center  xm:h-full my-3">
            <div>
              <div className="mx-4">
                <p className="text-3xl heading text-[#194866] text-center xm:text-left">
                  Welcome to Digital campus
                </p>
                <p className="text-sm  text-[#194866] ">
                  Transforming Education, Empowering Minds – Welcome to the
                  Digital Campus
                </p>
              </div>
              <Form page={true} />
            </div>
          </div>
        </div>
        {modal && <Otp page={true} />}
      </div>
    </div>
  );
}

export default Signup;
