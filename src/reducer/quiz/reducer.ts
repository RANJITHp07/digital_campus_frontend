import { QuizAction } from "./actions";
import { QuizState } from "./initalState";

export const reducer =(state:QuizState,action:QuizAction):QuizState=>{
   switch(action.type){
    case 'SET_EDIT' : 
        return { ...state, editQuestion: {...state.editQuestion,[action.field]:action.value }};
    case 'SET_ADD' : 
        return { ...state, question: {...state.question,[action.field]:action.value }};     
    case 'SET_TIMER':
        return { ...state, timer: action.value };
    case 'SET_TOPIC':
        return { ...state, topic: action.value };    
    case 'SET_DATE':
        return { ...state, date: action.value };    
    case 'SET_NUMBER':
        return { ...state, number: action.value };   
    case 'SET_EDIT_OPTION':
            return { ...state, edit: action.value };  
    case 'SET_ADD_QUESTION':
        return    { ...state, questions: [...state.questions,action.value] };    
    case 'SET_EDIT_QUESTION':
            return    { ...state, editQuestion:action.value };
    case 'SET_EDIT_OPTIONS':
            return    { ...state, editOption:action.value }; 
    case 'SET_ADD_OPTION':
            return    { ...state, option:action.value };
    case 'SET_QUESTIONS' :     
       return  { ...state, questions:action.value };                       
    }
}