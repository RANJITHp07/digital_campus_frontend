import { NavbarState } from "./initalState";



export const reducer = (state: NavbarState, action: NavbarAction): NavbarState => {
    switch (action.type) {
      case 'SET_FIELD':
        return { ...state, [action.field]: action.value };
      case 'SET_STATE':
        return { ...state, state: action.value };
      case 'SET_TEXT':
        return { ...state, text: action.value };
      case 'SET_FILTER':
        return { ...state, filter: action.value };
      case 'SET_OPEN':
        return { ...state, open: action.value };
      case 'SET_OPEN1':
        return { ...state, open1: action.value };
      case 'SET_OPEN2':
        return { ...state, open2: action.value };
      default:
        return state;
    }
  };