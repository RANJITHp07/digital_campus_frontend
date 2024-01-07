import gql from "graphql-tag";

export const CREATE_ASSIGNMENT = gql`
  mutation createAssignment($assignment: AssignmentInput) {
    createAssignment(assignment: $assignment) {
      title
      createdAt
      assignmentType
      _id
    }
  }
`;

export const EDIT_ASSIGNMENT = gql`
  mutation updateAssignment($id: String!, $update: AssignmentInput) {
    updateAssignment(id: $id, update: $update) {
      title
    }
  }
`;

export const DELETE_ASSIGNMENT = gql`
  mutation deleteAssignment($id: ID!) {
    deleteAssignment(id: $id) {
      title
      createdAt
      assignmentType
      _id
      mainTopic
    }
  }
`;

export const EDIT_ASSIGNMENT_DETAILS = gql`
  query getOneassignment($id: ID!) {
    getOneassignment(id: $id) {
      title
      instruction
      attachment {
        content
        type
      }
      mainTopic
      creator
      class_id
      students
      dueDate {
        day
        time
      }
      assignmentType
    }
  }
`;

export const EDIT_QUIZ_DETAILS = gql`
  query getOneassignment($id: ID!) {
    getOneassignment(id: $id) {
      title
      dueDate {
        day
        timer
      }
      quiz {
        question
        answers
        realAnswers
        type
      }
    }
  }
`;

export const EDIT_POLLING = gql`
  query getOneassignment($id: String!) {
    getOneassignment(id: $id) {
      title
      polling {
        answers
      }
      students
    }
  }
`;
