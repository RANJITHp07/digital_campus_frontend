export interface ClassroomProps{
    _id?:string,
    className?:string,
    classSection?:string,
    classSubject?:string,
    creator?:string,
    students_enrolled?:string[],
    admins?:string[],
    classCode?:string,
    backgroundPicture?:string,
    createdAt?:Date
    category?:string,
    block?:boolean
    profile?:string
}


export type Polling={
    number:number,
    question:string
}
