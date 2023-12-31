import { Question } from "@/@types/assignment";

export type QuizAction =
| { type: 'SET_EDIT'; field: string; value: string | string[] | null }
| { type: 'SET_ADD'; field: string; value: string | string[] | null }
| { type: 'SET_TIMER'; value:string[] }
| { type: 'SET_DATE'; value:string}
| { type: 'SET_TOPIC'; value:string}
| { type: 'SET_NUMBER'; value:number}
| { type: 'SET_EDIT_OPTION'; value:boolean}
| { type: 'SET_ADD_QUESTION'; value:Question}
| { type: 'SET_EDIT_QUESTION'; value:any}
| { type: 'SET_ADD_OPTION'; value:string}
| { type: 'SET_EDIT_OPTIONS'; value:string}
| { type: 'SET_QUESTIONS'; value:Question[]}