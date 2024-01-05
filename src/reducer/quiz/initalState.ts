import { Question } from "@/@types/assignment";

export interface QuizState {
  editQuestion: {
    editQuestion: string;
    editOptions: string[];
    editAnswer: string[];
    editType: string | null;
  };
  question: {
    answer: string[];
    question: string;
    type: string | null;
    options: string[];
    edit: boolean;

  };
  option: string;
  editOption:string
  questions: Question[];
  timer: string[];
  date: string;
  topic: string | null;
  number: number;
  edit:boolean

}

const initialQuizState: QuizState = {
  editQuestion: {
    editQuestion: '',
    editOptions: [],
    editAnswer: [],
    editType: null,
  },
  question: {
    answer: [],
    question: '',
    type: null,
    options: [],
    edit: false,
  },
  option: '',
  editOption:'',
  questions: [],
  timer: [],
  date: '',
  topic: null,
  number: 1,
  edit:false
};

export default initialQuizState;
