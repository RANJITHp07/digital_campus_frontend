import { UsersProps } from '@/@types/users';

export type ProfileAction =
  | { type: 'SET_USER'; value: UsersProps }
  | { type: 'SET_PROFILE'; value: string | null }
  | { type: 'SET_OPEN'; value: boolean }
  | { type: 'SET_MODAL'; value: boolean }
  | { type: 'SET_STATE'; value: boolean }  
  | { type: 'SET_FILE'; value: File | null }
  | { type: 'SET_NEWPASSWORD'; value: string }
  | { type: 'SET_OLDPASSWORD'; value: string }
  | { type: 'SET_UPDATE'; field: string; value: string | null }
  | { type: 'SET_HOVER'; value: boolean }
  | { type: 'SET_LOADING'; value: boolean };
