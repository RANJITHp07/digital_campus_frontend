'use client'
import React,{useLayoutEffect} from 'react'
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setForgetpassword, setToken } from '@/redux/features/auth-slice/reducer';

function AuthenticatedForgetPasswordProvider({children}:{children:React.ReactNode}) {
    
   const dispatch = useDispatch()

    useLayoutEffect(()=>{
        const accessToken = Cookies.get('forgetPassword') as string;
        let parsedAccessToken;
        try {
          parsedAccessToken = JSON.parse(accessToken);
          dispatch(setForgetpassword(parsedAccessToken));
        } catch (error) {
          console.error('Error parsing accessToken:', error);
        }
    })
  
    return children
}

export default AuthenticatedForgetPasswordProvider