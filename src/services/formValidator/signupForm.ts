import { UserForm } from "@/@types/users";

export const resolver=async (values:UserForm) => {
    let errors: Record<string, { type: string; message: string }> = {};
    const currentPath=typeof window !== 'undefined' ? window.location.pathname : '';
    // Check each field for empty values
    if (!values.firstName && currentPath!== '/login') {
      errors.firstName = {
        type: '',
        message: 'First Name is required.',
      };
    }
  
    if (!values.lastName  && currentPath!== '/login') {
      errors.lastName = {
        type: '',
        message: 'Last Name is required.',
      };
    }
  
    if (!values.username  && currentPath!== '/login') {
      errors.username = {
        type: '',
        message: 'Username is required.',
      };
    }
  
    if (!values.email) {
      errors.email = {
        type: '',
        message: 'Email is required.',
      };
    }
  
    if (!values.password ) {
      errors.password = {
        type: '',
        message: 'Password is required.',
      };
    }
  
    if (!values.confirm_password  && currentPath !== '/login') {
      errors.confirm_password = {
        type: '',
        message: 'Confirm Password is required.',
      };
    }
  
  
  
    // Check if passwords match
    if (values.password !== values.confirm_password && currentPath !== '/login') {
      errors.confirm_password = {
        type: 'passwordMatch',
        message: 'Passwords do not match.',
      };
    }
  
  
    return {
      values: Object.keys(values).length === (currentPath==='/login' ? 2 :6)  ? values : {},
      errors,
    };
}