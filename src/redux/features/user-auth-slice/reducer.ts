import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { senduserEmail, userlogin } from "./action";

interface InitialState {

    modal: boolean;
    loading: boolean;
    error: null | any;
    email:string
    user:any,

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
             modal:true
          }
      })

      .addCase(senduserEmail.rejected,(state,action)=>{
          return {
            ...state,
             loading:false,
             modal:false,
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

export const { openModal, closeModal,setEmail } = user.actions;
export default user.reducer;
