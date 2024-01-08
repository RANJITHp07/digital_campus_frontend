import React, { useState, ChangeEvent } from "react";
import { CircularProgress } from "@mui/material";
import { message } from "antd";
import Image from "next/image";
import { signInnWithGooogle } from "@/services/config/firebase";
import { SendEmail, getUser, userSignup } from "@/apis/user/user";
import { openModal, setEmail } from "@/redux/features/user-auth-slice/reducer";
import { useForm } from "react-hook-form";
import { UserForm } from "@/@types/users";
import { resolver } from "@/services/formValidator/signupForm";
import {
  senduserEmail,
  userlogin,
} from "@/redux/features/user-auth-slice/action";

import Cookies from "js-cookie";
import { useNavDispatch } from "@/hook/useNavDispatch";

interface FormProps {
  page: boolean;
}

const Form: React.FC<FormProps> = ({ page }) => {
  const { navigation, dispatch, appSelector } = useNavDispatch();
  const [email, setemail] = useState("");
  const [text, settext] = useState(false);
  const { loading, resend }: { loading: boolean; resend: boolean } =
    appSelector((state) => state.userReducer);

  //to handle the signup form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserForm>({
    resolver: async (values) => await resolver(values),
  });

  //to handle the normal signup
  const handleSignup = (data: UserForm) => {
    try {
      const user = {
        firstName: data.firstName as string,
        lastName: data.lastName as string,
        confirm_password: data.confirm_password as string,
        username: data.username as string,
        email: data.email,
        password: data.password,
      };
      dispatch(senduserEmail(user));
    } catch (err: any) {
      message.info(err.response.data.message);
    }
  };

  //to handle the forget password
  const handleForgetPassword = async () => {
    if (email.trim().length > 0) {
      const user = await getUser(email);
      if (user.data.success) {
        dispatch(setEmail(email));
        Cookies.set(
          "forgetPassword",
          JSON.stringify({ email: email, id: user.data.data.id })
        );
        await SendEmail(email, "user");
        message.success("Email sent");
        dispatch(openModal());
      }
    } else {
      message.info("Enter your email");
    }
  };

  //to handle the login of the user
  const handleLogin = async (data: UserForm) => {
    try {
      const res = await dispatch(userlogin(data));
      res.payload &&
        res.payload.success &&
        Cookies.set("accessToken", JSON.stringify(res.payload.data));
      res.payload && res.payload.success && navigation.push("/classroom");
    } catch (err: any) {
      message.info(err.response.data.message);
    }
  };

  //to handle the google authenticated signup
  const handleGooglesignup = async () => {
    try {
      const user = await signInnWithGooogle();
      const res = await userSignup(user);
      if (res.data.success) {
        message.success("Signup successfully");
        navigation.push("/login");
      } else {
        message.info(res.data.message);
      }
    } catch (err: any) {
      message.info(err.response.data.message);
    }
  };

  //to handle the google authentication login
  const handleGoogleLogin = async () => {
    try {
      const user = await signInnWithGooogle();
      const res = await dispatch(
        userlogin({ email: user?.email, password: user.password })
      );
      res.payload &&
        res.payload.success &&
        Cookies.set("accessToken", JSON.stringify(res.payload.data));
      res.payload && res.payload.success && navigation.push("/classroom");
    } catch (err: any) {
      message.info(err.response.data.message);
    }
  };

  return (
    <div className="mx-6 my-9 md:my-7 xm:my-4  lg:my-7">
      <form
        onSubmit={handleSubmit((data) =>
          page ? handleSignup(data) : handleLogin(data)
        )}
      >
        {page && (
          <div className="md:flex justify-center">
            <div className="md:w-1/2 md:mr-3">
              <label className="text-xs font-medium text-gray-400">
                {!errors.firstName && "FirstName"}
                <span className="text-red-500">
                  {errors.firstName ? errors.firstName.message : "*"}
                </span>
              </label>
              <input
                id="firstname"
                type="text"
                placeholder="Enter your firstname"
                className="block p-3 w-full md:p-2 lg:p-3 border-2 text-slate-500 border-gray-400 rounded-md shadow-sm focus:outline-none  sm:text-sm"
                {...register("firstName")}
              />
            </div>

            <div className="md:w-1/2">
              <label className="text-xs font-medium text-gray-400">
                {!errors.lastName && "LastName"}
                <span className="text-red-500">
                  {errors.lastName ? errors.lastName.message : "*"}
                </span>
              </label>
              <input
                id="lastname"
                type="text"
                placeholder="Enter your lastname"
                className="block w-full p-3 md:p-2 lg:p-3 border-2 text-slate-500 border-gray-400 rounded-md shadow-sm focus:outline-none  sm:text-sm"
                {...register("lastName")}
              />
            </div>
          </div>
        )}

        <div className="md:my-4 xm:my-3 lg:my-4">
          <label className="text-xs font-medium text-gray-400">
            {!errors.email && "email"}
            <span className="text-red-500">
              {errors.email ? errors.email.message : "*"}
            </span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="block w-full p-3 md:p-2 lg:p-3 border-2  border-gray-400 rounded-md shadow-sm focus:outline-none  sm:text-sm text-slate-500"
            {...register("email")}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setemail(e.target.value)
            }
          />
        </div>
        {page && (
          <div className="md:my-4 xm:my-3 lg:my-4">
            <label className="text-xs font-medium text-gray-400">
              {!errors.username && "username"}
              <span className="text-red-500">
                {errors.username ? errors.username.message : "*"}
              </span>
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              className="block w-full p-3 md:p-2 lg:p-3 border-2 border-gray-400 rounded-md shadow-sm focus:outline-none  sm:text-sm text-slate-500"
              {...register("username")}
            />
          </div>
        )}

        <div className="flex">
          <div className={` ${!page ? "w-full" : "md:w-1/2 md:mr-3"}`}>
            <label className="text-xs font-medium text-gray-400">
              {!errors.password && "password"}
              <span className="text-red-500">
                {errors.password ? errors.password.message : "*"}
              </span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="block p-3 w-full md:p-2 lg:p-3 border-2 text-slate-500 border-gray-400 rounded-md shadow-sm focus:outline-none  sm:text-sm"
              {...register("password")}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                e.target.value.length >= 8 ? settext(false) : settext(true);
              }}
            />

            {text && page && (
              <p className="text-xs text-red-500">
                minimum 8 charcters must be there
              </p>
            )}
          </div>
          {page && (
            <div className="md:w-1/2">
              <label className="text-xs font-medium text-gray-400">
                {!errors.confirm_password && "confirm_password"}
                <span className="text-red-500">
                  {errors.confirm_password
                    ? errors.confirm_password.message
                    : "*"}
                </span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="Confirm your password"
                className="block w-full p-3 md:p-2 lg:p-3 border-2 text-slate-500 border-gray-400 rounded-md shadow-sm focus:outline-none  sm:text-sm"
                {...register("confirm_password")}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`bg-[#194866] ${
            page ? "my-5" : "mt-5"
          } w-full text-white p-3 rounded-md`}
        >
          {page ? (
            loading ? (
              <CircularProgress className="text-white" />
            ) : resend ? (
              "Resend Otp"
            ) : (
              "Signup"
            )
          ) : loading ? (
            <CircularProgress className="text-white" />
          ) : (
            "Login"
          )}
        </button>
      </form>
      {!page && (
        <p
          className="text cursor-pointer mb-5 mt-1 text-xs mx-2 text-[#194866] underline text-end"
          onClick={() => handleForgetPassword()}
        >
          Forget Password?
        </p>
      )}
      <p className="text-center text-xs font-serif text-slate-500">
        {" "}
        {page ? "Also signup using" : "Also login using"}
      </p>
      <div className="flex justify-center">
        <Image
          src={"/google.png"}
          width={30}
          height={40}
          alt="google"
          className="rounded-full mt-3  cursor-pointer"
          onClick={page ? handleGooglesignup : handleGoogleLogin}
        />
      </div>
    </div>
  );
};

export default Form;
