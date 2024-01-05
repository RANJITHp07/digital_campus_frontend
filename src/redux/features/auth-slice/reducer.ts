import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

interface InitialState {
  token: {
    name:string|null
    id: number | null;
    email: string | null;
    role: string | null;
  },
  forgetPassword:{
    email:string,
    id:number | null
  },
}

export const initialState: InitialState = {
  token: {
    name:null,
    id: null,
    email: null,
    role: null,
  },
  forgetPassword:{
    email:'',
    id:null
  },
};

export const authentication = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<InitialState["token"]>) => {
      state.token = action.payload;
    },
    setForgetpassword:(state, action: PayloadAction<InitialState["forgetPassword"]>)=>{
      state.forgetPassword = action.payload;
    }
  },
});

export const { setToken,setForgetpassword,} = authentication.actions;
export default authentication.reducer;
