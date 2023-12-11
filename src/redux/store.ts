import { configureStore } from "@reduxjs/toolkit";
import {TypedUseSelectorHook,useSelector} from "react-redux"
import userReducer from './features/user-auth-slice/reducer'
import  classroomReducer  from "./features/classroom-slice/reducer";
import authReducer from "./features/auth-slice/reducer"

export const store=configureStore({
    reducer:{
        authReducer,
        userReducer,
        classroomReducer
    }
})

export type RootStore=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch
export const useAppSelector:TypedUseSelectorHook<RootStore> = useSelector