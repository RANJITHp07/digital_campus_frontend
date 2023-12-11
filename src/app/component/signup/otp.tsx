import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { useAppSelector } from '@/redux/store';
import { emailVerification, userSignup } from '@/apis/user';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';
import { closeModal } from '@/redux/features/user-auth-slice/reducer';

function Otp({page}:{page:boolean}) {

  const dispatch = useDispatch()
  const navigate=useRouter()
  const email=useAppSelector((state)=>state.userReducer.email)
  const { user, loading} = useAppSelector((state) => state.userReducer);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [otp,setotp]=useState(false)
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const inputRefs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));
  const [remainingTime, setRemainingTime] = useState(60); // Set the initial remaining time to 60 seconds

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (value && index < 5) {
      setCurrentInputIndex(index + 1);
      inputRefs[index + 1].current?.focus();
    }
    const newOtpValues = [...otpValues];
  newOtpValues[index] = value;
  setOtpValues(newOtpValues);
  };

    // Handle OTP submission here
  const handleSubmit = async() => {
    try{
      const otpSum = otpValues.reduce((sum, value) => sum + value, '');
       const response= await emailVerification(otpSum,user.email)
       if(response.data.success){
       const res= await userSignup(user)
       if(res.data.success){
           message.success("Signup successfully")
           dispatch(closeModal())
           navigate.push("/login")
       } 
      }else{
        setotp(true)
      } 
    }catch(err){
        throw err
    }
  };

  //to handle the forget password
  const handleForgetPassword = async() => {
    try{
      const otpSum = otpValues.reduce((sum, value) => sum + value, '');
       const response= await emailVerification(otpSum,email)
       if(response.data.success){
        dispatch(closeModal())
        navigate.push('/forgetpassword')
      }else{
        setotp(true)
      } 
    }catch(err){
        throw err
    }
  };


  useEffect(() => {
    const timer = setInterval(() => {
      if (remainingTime > 0) {
        setRemainingTime(remainingTime - 1);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [remainingTime]);

  useEffect(() => {
    // Close the OTP modal after 1 minute
    const modalCloseTimer = setTimeout(() => {
      dispatch(closeModal())
    }, 60000);

    return () => {
      clearTimeout(modalCloseTimer);
    };
  }, []);

  const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && index > 0) {
      console.log(index)
      const newOtpValues = [...otpValues];
    newOtpValues[index] = '';
    setOtpValues(newOtpValues);
      setCurrentInputIndex(index-1);
      inputRefs[index-1].current?.focus();
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 backdrop-blur-md transform -translate-x-1/2 -translate-y-1/2 box_shadow bg-white rounded-lg p-3 opacity-100">
      <p className="text-center">{page ? "Otp verification" : "Forget Password"}</p>
      <div className="grid place-content-center my-3">
        <Image src={'/otp.png'} height={300} width={300} alt="otp" className="text-center" />
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
              if (e.key === 'Enter') {
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
      {
        otp &&  <p className='text-xs text-red-400 text-center mt-2'>Wrong OTP </p>
      }
      <p className="text-center mb-2">Remaining time: {remainingTime} seconds</p>
      <button className="bg-[#194866] mt-5 rounded-lg p-3 text-white w-full" onClick={ page ? handleSubmit : handleForgetPassword}>
        {loading ? <CircularProgress className='text-white'/> : "Submit"}
      </button>
    </div>
  );
}

export default Otp;
