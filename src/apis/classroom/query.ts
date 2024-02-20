import gql from "graphql-tag";

// Queries

// to get the user created classrooms
export const FETCH_CLASSROOM_QUERY = gql`
  query GetCreatorClassroom($id: String!) {
    getCreatorClassroom(id: $id) {
      _id
      className
      creator
      classSection
      classSubject
      classCode
      backgroundPicture
      themeColor
      profile
    }
  }
`;

// to get the added classrooms
export const FETCH_ADDED_CLASSROOM_QUERY = gql`
  query getAllClassroom($id: String!) {
    getAllClassroom(id: $id) {
      _id
      className
      creator
      classSection
      classCode
      classSubject
      backgroundPicture
      themeColor
      profile
    }
  }
`;

// to get all the classrooms
export const FETCH_ALL_CLASSROOM_QUERY = gql`
  query getAllTheClassroom($id: String!) {
    getAllTheClassroom(id: $id) {
      _id
      className
      creator
      classSection
      students_enrolled
      classSubject
      backgroundPicture
      classCode
      profile
      blockClassroom
    }
  }
`;

// to get all the classroom names
export const FETCH_ALL_CLASSROOM_NAMES = gql`
  query getAllTheClassroom($id: String!) {
    getAllTheClassroom(id: $id) {
      _id
      className
    }
  }
`;

// to fetch all the classroom details
export const FETCH_CLASSROOM_DETAILS = gql`
  query getClassroomDetails($id: String!) {
    getClassroomDetails(id: $id) {
      classCode
      className
      students_enrolled
      creator
      backgroundPicture
      admins
      themeColor
    }
  }
`;

export const FETCH_REQUEST_DETAILS = gql`
  query getClassroomDetails($id: String!) {
    getClassroomDetails(id: $id) {
      request {
        id
        name
        email
      }
    }
  }
`;

// to fetch all the participants
export const GET_PARTICIPANTS = gql`
  query getAllClassroomparticipants($id: String!) {
    getAllClassroomparticipants(id: $id) {
      admin {
        username
        profile
        id
      }
      user {
        id
        profile
        username
      }
    }
  }
`;

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
  query  getAllUsersClassrooms($page:Int) {
    getAllUsersClassrooms(page:$page) {
      _id
      className
      classCode
      creator
      blockClassroom
    }
  }
`;

// to search all reported the classrooms
export const SEARCH_CLASSROOMS = gql`
  query searchClassroom($page:Int!,$text:String!) {
    searchClassroom(page:$page,text:$text) {
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
  query getFilteredClassroom($id: String!, $category: [String]) {
    getFilteredClassroom(id: $id, category: $category) {
      _id
      className
      creator
      classSection
      students_enrolled
      classSubject
      backgroundPicture
      classCode
      profile
    }
  }
`;
