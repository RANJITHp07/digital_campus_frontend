import gql from 'graphql-tag'

// Queries

// to get the user created classrooms
export const FETCH_CLASSROOM_QUERY = gql`
  query GetCreatorClassroom($id: String!) {
    getCreatorClassroom(id: $id) {
      _id,
      className,
      creator,
      classSection,
      classSubject,
      classCode
      backgroundPicture,
      themeColor,
      profile
    }
  }
`;

// to get the added classrooms
export const FETCH_ADDED_CLASSROOM_QUERY = gql`
  query getAllClassroom($id: String!) {
    getAllClassroom(id: $id) {
      _id,
      className,
      creator,
      classSection,
      classCode,
      classSubject,
      backgroundPicture,
      themeColor,
      profile
    }
  }
`;

// to get all the classrooms
export const FETCH_ALL_CLASSROOM_QUERY = gql`
  query getAllTheClassroom($id: String!) {
    getAllTheClassroom(id: $id) {
      _id,
      className,
      creator,
      classSection,
      students_enrolled,
      classSubject,
      backgroundPicture,
      classCode,
      profile,
      blockClassroom
    }
  }
`;

// to get all the classroom names
export const FETCH_ALL_CLASSROOM_NAMES = gql`
  query getAllTheClassroom($id: String!) {
    getAllTheClassroom(id: $id) {
      _id,
      className
    }
  }
`;

// to fetch all the classroom details
export const FETCH_CLASSROOM_DETAILS = gql`
  query getClassroomDetails($id: String!) {
    getClassroomDetails(id: $id) {
      classCode
      className,
      students_enrolled,
      creator,
      backgroundPicture,
      admins,
      themeColor
    }
  }
`;


export const FETCH_REQUEST_DETAILS = gql`
  query getClassroomDetails($id: String!) {
    getClassroomDetails(id: $id) {
      request{
        id
        name
      }
    }
  }
`;

// to fetch all the participants
export const GET_PARTICIPANTS = gql`
 query getAllClassroomparticipants($id: String!){
  getAllClassroomparticipants(id:$id){
    admin {
       username,
       profile,
       id
     }
     user {
       id,
       profile,
       username
     }
  }
 }
`

// to fetch all the classrooms
export const GET_REPORTED_CLASSROOMS = gql`
  query reportedClassroom {
    reportedClassroom {
      className
      classCode
      reason {
        title
        description
      }
    }
  }
`;


// to fetch all reported the classrooms
export const GET_CLASSROOMS = gql`
  query getclassrooms {
    getclassroom {
      _id
      className
      classCode
      creator
      blockClassroom
    }
  }
`;

// to get the filtered classroom
export const GET_FILTRED_CLASSROOM = gql`
  query getFilteredClassroom($id:String!,$category:[String]) {
    getFilteredClassroom(id:$id,category:$category) {
      _id,
      className,
      creator,
      classSection,
      students_enrolled,
      classSubject,
      backgroundPicture,
      classCode
    }
  }
`;

// Mutations

// to create classroom
export const CREATE_CLASS = gql`
  mutation createClass( 
  $className:String!
  $classSubject:String! 
  $classSection:String! 
  $creator:String!
  $admins:[String]!
  $category:String!
  $backgroundPicture:String!
  ){
    createClass(
    classroom:
    {
    className:$className,
    classSubject:$classSubject,
    classSection:$classSection,
    creator:$creator,
    admins:$admins,
    category:$category,
    backgroundPicture:$backgroundPicture
    }
    ) {
      _id,
      className,
      creator
    }
  }
`;

// to add student into the classroom
export const ADD_STUDENT = gql`
  mutation addStudent( 
  $code:String!
  $userId:String!
  ){
    addStudent(
    addstudent:
    {
     code:$code,
     userId:$userId
    }
    ) {
      message
    }
  }
`;

//to add student into a add student request
export const ADD_REQUEST=gql`
 mutation addRequest($request:RequestInput){
     addRequest(request:$request){
     message
     }
 }
`

//to remove the student from the request
export const REMOVE_REQUEST=gql`
 mutation removeRequest($request:RequestInput){
     removeRequest(request:$request){
     message
     }
 }
`

// to delete the classroom
export const DELETE_CLASS = gql`
  mutation deleteClass($id:String!){
    deleteClass(id:$id) {
      message
    }
  }
`;

// to remove a student from a classroom
export const REMOVE_STUDENT = gql`
  mutation deleteStudent( 
  $code:String!
  $userId:String!
  ){
    deleteStudent(
    deletedstudent:
    {
     code:$code,
     userId:$userId
    }
    ) {
      message
    }
  }
`;

// to update the classroom details 
export const UPDATE_CLASS = gql`
  mutation updateClass($update:updateClasroom, $id: String!) {
    updateClass(id:$id, update:$update)
     {
      message
    }
  }
`;

// to update the classroom details
export const UPDATE_CLASSROOM_DETAILS = gql`
  mutation updateClass($id: String!, $update: updateClasroom) {
    updateClass(id: $id, update: $update) {
      message
    }
  }
`;

//to add student into the admins
export const ADD_TO_ADMIN=gql`
 mutation addToAdmin($id:String,$classroomId:String){
    addToAdmin(id:$id,classroomId:$classroomId){
    message
    }
 }
`
//to remove a student from the classroom
export const REMOVE_FROM_ADMIN=gql`
 mutation removeFromAdmin($id:String,$classroomId:String){
    removeFromAdmin(id:$id,classroomId:$classroomId){
    message
    }
 }
`

export const SEND_INVITATION=gql`
 mutation emailInvitation($invitation:Invitation){
   emailInvitation(invitation:$invitation){
    message
   }
 }
`

