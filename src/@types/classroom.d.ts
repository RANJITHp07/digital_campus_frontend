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

export interface ClassProps {
  className: string;
  creator: string;
  id: string;
  code?: string;
  type: boolean;
  bg: string;
  subject?: string;
  section?: string;
  profile: string;
  block?: boolean;
}

export type Polling = {
  number: number;
  question: string;
};
