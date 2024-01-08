export interface Question {
  type: 'checkbox' | 'radio';
  question: string;
  answers: string[];
  realAnswers: any[];
  edit: boolean;
}

export interface Event {
  title: string;
  dueDate: {
    day: string;
    time: string;
  };
  creator: string;
  class_id: string[];
}

export interface Polling {
  __typename: string;
  title: string;
  polling: {
    __typename?: string;
    answers: string[];
  };
  students: string[];
}

export interface Comment {
  username: string;
  comment: string;
}

export interface Quiz {
  question: string;
  answers: string[];
  type: string;
  realAnswers: string[];
}


export interface AssignmentDetails {
  _id: string;
  title: string;
  assignmentType: string;
  createdAt:string
}

export type ThemeKey = '#374151' | '#3b6a87' | '#ef4444' | '#3b82f6' | '#533b87' | '#10b981';

export interface ThemeColor {
  [key in ThemeKey]: boolean;
}

export interface ThemeText {
  [key in ThemeKey]: string;
}

export interface Assignment {
  assignments: {
    title: string;
    createdAt: string;
    assignmentType: string;
    _id: string;
  }[];
  _id: string;
}

export interface EditAssignment  extends AssignmentDetails{
  instruction: string;
  attachment: {
    content: string;
    type: string;
  };
  mainTopic: string;
  creator: string;
  points: number;
  class_id: string; 
  students: string[]; 
  dueDate: {
    day: string;
    time: string;
  };
}


