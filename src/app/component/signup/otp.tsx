import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { emailVerification, userSignup } from "@/apis/user/user";
import { message } from "antd";
import { CircularProgress } from "@mui/material";
import {
  closeModal,
  setResend,
} from "@/redux/features/user-auth-slice/reducer";
import { useNavDispatch } from "@/hook/useNavDispatch";

interface OtpProps {
  page: boolean;
}

const Otp: React.FC<OtpProps> = ({ page }) => {
  const { navigation, dispatch, appSelector } = useNavDispatch();
  const { user, loading, email } = appSelector((state) => state.userReducer);
  const [otpValues, setOtpValues] = useState<Array<string>>(Array(6).fill(""));
  const [otpError, setOtpError] = useState(false);
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const inputRefs = Array.from({ length: 6 }, () =>
    useRef<HTMLInputElement>(null)
  );
  const [remainingTime, setRemainingTime] = useState(60);

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  //to handel the otp input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (value && index < 5) {
      setCurrentInputIndex(index + 1);
      inputRefs[index + 1].current?.focus();
    }
    setOtpValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });
  };

  //to handle the otp submit
  const handleSubmit = async () => {
    try {
      const otpSum = otpValues.join("");
      const response = await emailVerification(otpSum, user.email);
      if (response.data.success) {
        const res = await userSignup(user);
        if (res.data.success) {
          message.success("Signup successful");
          dispatch(closeModal());
          navigation.push("/login");
        }
      } else {
        setOtpError(true);
      }
    } catch (err) {
      setOtpError(true);
    }
  };

  // to handle the forget password otp verification
  const handleForgetPassword = async () => {
    try {
      const otpSum = otpValues.join("");
      const response = await emailVerification(otpSum, email);
      if (response.data.success) {
        dispatch(closeModal());
        navigation.push("/forgetpassword");
      }
    } catch (err) {
      setOtpError(true);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 1 : prevTime));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const modalCloseTimer = setTimeout(() => {
      dispatch(setResend(true));
      dispatch(closeModal());
    }, 60000);

    return () => {
      clearTimeout(modalCloseTimer);
    };
  }, []);

  //to handle the backspace when user clicks the backspace
  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && index > 0) {
      setOtpValues((prevValues) => {
        const newValues = [...prevValues];
        newValues[index] = "";
        return newValues;
      });
      setCurrentInputIndex(index - 1);
      inputRefs[index - 1].current?.focus();
    }else{
      setOtpError(false)
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 backdrop-blur-md transform -translate-x-1/2 -translate-y-1/2 box_shadow bg-white rounded-lg p-3 opacity-100">
      <p className="text-center">
        {page ? "Otp verification" : "Forget Password"}
      </p>
      <div className="grid place-content-center my-3">
        <Image
          src={"/otp.png"}
          height={300}
          width={300}
          alt="otp"
          className="text-center"
        />
      </div>
      <div className="flex justify-between">
        {inputRefs.map((inputRef, index) => (
          <input
            key={index}
            ref={inputRef}
            className="border-2 rounded-xl text-center h-9 w-9 md:w-12 md:h-12 overflow-hidden mx-2"
            maxLength={1}
            type="text"
            value={otpValues[index]}
            onChange={(e) => handleInputChange(e, index)}
            onKeyDown={(e) => handleBackspace(e, index)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                if (index < 5) {
                  inputRefs[index + 1].current?.focus();
                } else {
                  handleSubmit();
                }
              }
            }}
            required
          />
        ))}
      </div>
      {otpError && (
        <p className="text-xs text-red-400 text-center mt-2">Wrong OTP </p>
      )}
      <p className="text-center mb-2">
        Remaining time: {remainingTime} seconds
      </p>
      <button
        className="bg-[#194866] mt-5 rounded-lg p-3 text-white w-full"
        onClick={page ? handleSubmit : handleForgetPassword}
      >
        {loading ? <CircularProgress className="text-white" /> : "Submit"}
      </button>
    </div>
  );
};

export default Otp;
