import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { senduserEmail, userlogin } from "./action";

interface InitialState {

    modal: boolean;
    loading: boolean;
    error: null | any;
    email:string
    user:any,
    resend:boolean

}

export const initialState: InitialState = {
    modal: false,
    loading: false,
    error: null,
    email:'',
    user:{
        firstName:'',
        lastName:'',
        username:'',
        email:'',
        password:'',
  },
  resend:false

};

export const user = createSlice({
  name: "OTP",
  initialState,
  reducers: {
    openModal: (state) => {
      state.modal = true;
    },
    closeModal: (state) => {
      state.modal = false;
    },
    setEmail:(state,action)=>{
      state.email =action.payload
    },
    setResend:(state,action)=>{
      state.resend =action.payload
    },
  },
  extraReducers(builder) {
    builder
      // sending email
      .addCase(senduserEmail.pending,(state)=>{
         return {
            ...state,
            loading:true
         }
      })

      .addCase(senduserEmail.fulfilled,(state,action:PayloadAction<any>)=>{
          return {
            ...state,
             user:action.payload,
             loading:false,
             modal:true,
          }
      })

      .addCase(senduserEmail.rejected,(state,action)=>{
          return {
            ...state,
             loading:false,
             error:action.error
          }
      })


      //login
      .addCase(userlogin.pending,(state)=>{
        return {
           ...state,
           loading:true
        }
     })

     .addCase(userlogin.fulfilled,(state,action:PayloadAction<any>)=>{
         return {
           ...state,
            loading:false,
         }
     })

     .addCase(userlogin.rejected,(state,action)=>{
         return {
           ...state,
            loading:false,
            modal:false,
            error:action.error
         }
     })
  },
});

export const { openModal, closeModal,setEmail,setResend } = user.actions;
export default user.reducer;
