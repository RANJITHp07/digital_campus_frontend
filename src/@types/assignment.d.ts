export interface Question{
    type:string,
    question:string,
    answers:string[],
    edit:boolean
}


export interface Event{
    title:string,
    dueDate:{
        day:string,
        time:string
    },
    creator:string,
    class_id:string[]
}