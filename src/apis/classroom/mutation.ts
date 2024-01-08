import gql from "graphql-tag";

// to create classroom
export const CREATE_CLASS = gql`
  mutation createClass(
    $className: String!
    $classSubject: String!
    $classSection: String!
    $creator: String!
    $admins: [String]!
    $category: String!
    $backgroundPicture: String!
  ) {
    createClass(
      classroom: {
        className: $className
        classSubject: $classSubject
        classSection: $classSection
        creator: $creator
        admins: $admins
        category: $category
        backgroundPicture: $backgroundPicture
      }
    ) {
      _id
      className
      creator
    }
  }
`;

// to add student into the classroom
export const ADD_STUDENT = gql`
  mutation addStudent($code: String!, $userId: String!) {
    addStudent(addstudent: { code: $code, userId: $userId }) {
      message
    }
  }
`;

//to add student into a add student request
export const ADD_REQUEST = gql`
  mutation addRequest($request: RequestInput) {
    addRequest(request: $request) {
      message
    }
  }
`;

//to remove the student from the request
export const REMOVE_REQUEST = gql`
  mutation removeRequest($request: RequestInput) {
    removeRequest(request: $request) {
      message
    }
  }
`;

// to delete the classroom
export const DELETE_CLASS = gql`
  mutation deleteClass($id: String!) {
    deleteClass(id: $id) {
      message
    }
  }
`;

// to remove a student from a classroom
export const REMOVE_STUDENT = gql`
  mutation deleteStudent($code: String!, $userId: String!) {
    deleteStudent(deletedstudent: { code: $code, userId: $userId }) {
      message
    }
  }
`;

// to update the classroom details
export const UPDATE_CLASS = gql`
  mutation updateClass($id: String!, $update: updateClasroom) {
    updateClass(id: $id, update: $update) {
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
export const ADD_TO_ADMIN = gql`
  mutation addToAdmin($id: String, $classroomId: String) {
    addToAdmin(id: $id, classroomId: $classroomId) {
      message
    }
  }
`;
//to remove a student from the classroom
export const REMOVE_FROM_ADMIN = gql`
  mutation removeFromAdmin($id: String, $classroomId: String) {
    removeFromAdmin(id: $id, classroomId: $classroomId) {
      message
    }
  }
`;

export const SEND_INVITATION = gql`
  mutation emailInvitation($invitation: Invitation) {
    emailInvitation(invitation: $invitation) {
      message
    }
  }
`;
