export interface UsersProps {
    id?: number;
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    profile?: string | null;
    password?: string;
    created_at?: string;
    blocked?: boolean;
    about?: string;
    education?: string;
  }

export interface UserForm{
    firstName?: string;
    lastName?: string;
    username?: string;
    email: string;
    password:string,
    confirm_password?: string;
}  

  

export interface AdminProps{
    email:string 
    username:string 
    password:string 
}

export interface Detail{
    about:string | null ,
    education:string | null
}