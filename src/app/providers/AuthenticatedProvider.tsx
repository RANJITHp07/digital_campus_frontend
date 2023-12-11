'use client'
import React,{useLayoutEffect} from 'react'
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setToken } from '@/redux/features/auth-slice/reducer';
import { jwtDecode } from 'jwt-decode';

function AuthenticatedProvider({children}:{children:React.ReactNode}) {
    
   const dispatch = useDispatch()

    useLayoutEffect(()=>{
        const accessToken = Cookies.get('accessToken') as string;
        let parsedAccessToken;
        try {
          parsedAccessToken = JSON.parse(accessToken);
          const token:any=jwtDecode(parsedAccessToken)
          dispatch(setToken(token))
        } catch (error) {
          console.error('Error parsing accessToken:', error);
        }
    })
  
    return children
}

export default AuthenticatedProvider