import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
     open:boolean
     type:string
     assignment:string
     creator:boolean
     adminType:string
     categoryType:boolean
     category:string[],
     chatOpen:boolean
}

export const initialState: InitialState = {
   open:true,
   type:"home",
   assignment:"stream",
   creator:false,
   adminType:"users",
   categoryType:true,
   category:[],
   chatOpen:false
};

export const classroom= createSlice({
  name: "classroom",
  initialState,
  reducers: {
    changeModalState: (state) => {
      state.open = !state.open;
    },
    changeChatState: (state,action:PayloadAction<boolean>) => {
      state.chatOpen = action.payload;
    },

    changeType:(state,actions)=>{
         state.type=actions.payload
    },
    changeAssignment:(state,actions:PayloadAction<string>)=>{
      state.assignment=actions.payload
 },
   changeToCreator:(state,actions:PayloadAction<boolean>)=>{
    state.creator=actions.payload
   },
   changeAdmintype:(state,actions:PayloadAction<string>)=>{
    state.adminType=actions.payload
   },
   changeCategoryType:(state,actions:PayloadAction<boolean>)=>{
    state.categoryType=actions.payload
   },
   getCategory:(state,actions:PayloadAction<string>)=>{
      if(state.category.includes(actions.payload)){
         if(state.category.length===1){
            state.categoryType=true
         }
         const category = state.category.filter((c)=>c!==actions.payload)
         state.category=category
      }else{
        if(state.category.length===0){
          state.categoryType=false
       }
        state.category=[...state.category,actions.payload]
      }
      state.type="home"
   }

  },
  
});

export const { changeModalState,changeType,changeAssignment,changeToCreator,changeAdmintype,changeCategoryType,getCategory,changeChatState} = classroom.actions;
export default classroom.reducer;
