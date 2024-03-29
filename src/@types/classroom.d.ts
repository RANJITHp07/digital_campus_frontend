export interface ClassroomProps {
  _id?: string;
  className?: string;
  classSection?: string;
  classSubject?: string;
  creator?: string;
  students_enrolled?: string[];
  admins?: string[];
  classCode?: string;
  backgroundPicture?: string;
  createdAt?: Date;
  category?: string;
  block?: boolean;
  profile?: string;
  blockClassroom?: boolean;
  themeColor?: string;
}

export interface ClassProps extends Omit<ClassroomProps, '_id' | 'createdAt'> {
  id: string;
  type: boolean;
  bg: string;
}


export type Polling = {
  number: number;
  question: string;
};

export type ImprovedPolling = Omit<PollingProps, 'number'> & {
  id: string;
};

export interface ClassroomParticipants {
    id: string;
    profile: string;
    username: string;

}

export interface Classroom {
  _id: string;
  className: string;
  classCode: string;
  creator: string;
  blockClassroom: boolean;
}


