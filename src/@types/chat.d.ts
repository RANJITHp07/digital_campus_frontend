export interface Sender{
    user_id:string,
    username:string,
    profile:string
  }

export type Message = {
    classId: string;
    sender: any ;
    text: {
      type: string; 
      text: string;
      desc?:string
    };
    createdAt?:string
  };