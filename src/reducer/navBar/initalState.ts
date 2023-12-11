export interface NavbarState {
    name: string | null;
    subject: string | null;
    section: string | null;
    code: string | null;
    category: string;
    state: boolean;
    text: string;
    filter: any[]; // Update this type based on the actual type of filter data
    open: boolean;
    open1: boolean;
    open2: boolean;
  }
  
  const initialState: NavbarState = {
    name: null,
    subject: null,
    section: null,
    code: null,
    category: 'Junior level',
    state: false,
    text: '',
    filter: [],
    open: false,
    open1: false,
    open2: false,
  };
  
  export {  initialState };
  