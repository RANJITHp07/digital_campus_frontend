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
  created_at: string;
}

export interface UserForm {
  firstName?: string;
  lastName?: string;
  username?: string;
  email: string;
  password: string;
  confirm_password?: string;
}

export interface AdminProps {
  email: string;
  username: string;
  password: string;
}

export interface Detail {
  about: string | null;
  education: string | null;
}

export interface RequestUser {
  __typename: string;
  email: string;
  code: string;
  name: string;
  id: string;
}
