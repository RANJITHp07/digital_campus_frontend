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

export interface Polling{
    __typename:string,
    title:string,
    polling:{
        __typename?:string,
        answers:string[]
    },
    students:string[]
}

