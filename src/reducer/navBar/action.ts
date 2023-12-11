type NavbarAction =
  | { type: 'SET_FIELD'; field: string; value: any }
  | { type: 'SET_STATE'; value: boolean }
  | { type: 'SET_TEXT'; value: string }
  | { type: 'SET_FILTER'; value: any[] }
  | { type: 'SET_OPEN'; value: boolean }
  | { type: 'SET_OPEN1'; value: boolean }
  | { type: 'SET_OPEN2'; value: boolean };
  