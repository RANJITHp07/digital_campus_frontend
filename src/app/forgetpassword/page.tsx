'use client'
import { updatePassword } from '@/apis/user';
import { useAppSelector } from '@/redux/store';
import { message } from 'antd';
import React,{ChangeEvent, useState} from 'react'
import {useRouter} from 'next/navigation'
import Cookies from 'js-cookie';


function ForgetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const forgetToken = useAppSelector((state) => state.authReducer.forgetPassword);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.trim().length === 0 || confirmPassword.trim().length === 0) {
      return message.info("Enter both password fields");
    }

    if (password.length < 8) {
      return message.info("Password must be at least 8 characters long");
    }

    if (password !== confirmPassword) {
      return message.info("Passwords do not match");
    }

    try {
      setLoading(true);
      const id = forgetToken.id as number;
      const res = await updatePassword(id, password);

      if (res.data.success) {
        Cookies.remove('forgetPassword');
        router.push('/login');
      }
    } catch (error) {
      console.error("Error updating password:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid place-content-center h-screen">
      <div className="md:w-[30rem] p-3 mx-2 md:p-6 border-2 rounded-md box_shadow">
        <p className="text text-2xl text-[#194866]">Forgot Password</p>
        <p className="text text-[#194866]">Please ensure your password is secure and handle it with care</p>
        <form className="my-4" onSubmit={handleSubmit}>
          <input
            type="text"
            className={`p-2 w-full border-2 ${password.length !== 0 && password.length < 8 ? "mt-4" : "my-4"}  rounded-md text`}
            placeholder="Enter your new password"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, setPassword)}
          />
          {password.length !== 0 && password.length < 8 && (
            <p className="text-xs mb-4 text-red-500 text">Minimum 8 characters must be there</p>
          )}

          <input
            type="password"
            className="p-2 w-full border-2 rounded-md text"
            placeholder="Confirm your new password"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, setConfirmPassword)}
          />
          <button
            type="submit"
            className="w-full p-2 my-4 bg-[#194866] text-white rounded-md text"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;
