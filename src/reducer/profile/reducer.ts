import { ProfileAction } from "./actions";
import { ProfileState } from "./initalState";

export const reducer = (state: ProfileState, action: ProfileAction): ProfileState => {
    switch (action.type) {
      case 'SET_USER':
        return { ...state, user: action.value };
      case 'SET_PROFILE':
        return { ...state, profile: action.value };
      case 'SET_OPEN':
        return { ...state, open: action.value };
      case 'SET_MODAL':
        return { ...state, modal: action.value };
     case 'SET_STATE':
        return { ...state, state: action.value };
      case 'SET_FILE':
        return { ...state, file: action.value };
      case 'SET_NEWPASSWORD':
        return { ...state, newpassword: action.value };
        case 'SET_HOVER':
        return { ...state, hover: action.value };
      case 'SET_OLDPASSWORD':
        return { ...state, oldpassword: action.value };
    case 'SET_OLDPASSWORD':
        return { ...state, oldpassword: action.value };
      case 'SET_UPDATE' : 
        return { ...state, update: {...state.update,[action.field]:action.value }};   

      default:
        return state;
    }
  };