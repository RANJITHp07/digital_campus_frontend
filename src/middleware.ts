import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parse } from "cookie";

export default function middleware(req: NextRequest) {
    const cookies = parse(req.headers.get("Cookie") || "");
  const userToken = cookies.accessToken;
  const forgetToken=cookies.forgetPassword;
  let jwt:any={}
  if(userToken){
    jwt=jwtDecode(userToken)
  }
  if (!userToken && req.nextUrl.pathname.startsWith('/classroom') && jwt.role!=='user' ) {
    const absoluteURL = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  if (userToken && (req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup'))  ) {
    const absoluteURL = new URL("/classroom", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  if(req.nextUrl.pathname.startsWith('/admin/dashboard') && jwt.role!='admin'){
    const absoluteURL = new URL("/admin/login", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
  
  if(req.nextUrl.pathname.startsWith('/forgetpassword') && !forgetToken){
    const absoluteURL = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  if(req.nextUrl.pathname.startsWith('/') && userToken){
    const absoluteURL = new URL("/classroom", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}