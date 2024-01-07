"use client";
import React, { useLayoutEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setToken } from "@/redux/features/auth-slice/reducer";
import { jwtDecode } from "jwt-decode";
import { Socket, io } from "socket.io-client";

function AuthenticatedProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const socket = useRef<Socket | null>();

  useLayoutEffect(() => {
    const accessToken = Cookies.get("accessToken") as string;
    let parsedAccessToken;
    try {
      parsedAccessToken = JSON.parse(accessToken);
      const token: any = jwtDecode(parsedAccessToken);
      if (!socket.current) {
        socket.current = io("wss://www.digitalcampus.shop", {
          path: "/socket-auth/",
        });
        socket.current.emit("join-room", token.email);
        socket.current.emit("isBlocked", { email: token.email });
        socket.current.on(
          "responseIsBlocked",
          (data: { isBlocked: boolean }) => {
            console.log(data);
            if (data.isBlocked) {
              Cookies.remove("accessToken");
              window.location.href = "/login";
            }
          }
        );
      }
      dispatch(setToken(token));
    } catch (error) {
      console.error("Error parsing accessToken:", error);
    }
  });

  return children;
}

export default AuthenticatedProvider;
