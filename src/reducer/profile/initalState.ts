import { UsersProps } from "@/interfaces/users";

export interface ProfileState {
    user: UsersProps;
    profile: string | null;
    open: boolean;
    modal: boolean;
    file: File | null;
    newpassword: string;
    oldpassword: string;
    update: {
      education: string | null;
      about: string | null;
    };
    state: boolean
  }

const initialState:ProfileState={
   user:{},
   profile: null,
   open:false,
   modal:false,
   file:null,
   newpassword:'',
   oldpassword:'',
   update:{
    education:null,
    about:null
   },
   state:false

}

export {initialState}