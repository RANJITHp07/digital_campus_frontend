import gql from "graphql-tag";

export const FETCH_ASSIGNMENT_DETAILS = gql`
  query getAllassignment($id: ID!) {
    getAllassignment(id: $id) {
      _id
      title
      assignmentType
      dueDate{
       day
      }
      mainTopic
    }
  }
`;

export const FETCH_MAINTOPIC = gql`
  query getdistinctmainTopic($id: ID!) {
    getdistinctmainTopic(id: $id) {
      mainTopic
    }
  }
`;

export const GROUPED_ASSIGNMENT = gql`
  query getgroupedAssignment($id: ID!) {
    getgroupedAssignment(id: $id) {
      _id
      assignments {
        title
        createdAt
        assignmentType
        _id
      }
    }
  }
`;

export const ASSIGNMENT_DETAILS = gql`
  query getOneassignment($id: ID!) {
    getOneassignment(id: $id) {
      _id
      title
      instruction
      students
      attachment {
        content
        type
      }
      dueDate {
        day
        time
        timer
      }
      creator
      assignmentType
      polling {
        answers
      }
      quiz {
        answers
        type
        question
      }
      points
      createdAt
    }
  }
`;

export const DUE_DATES = gql`
  query getDueDates($id: String!) {
    getDueDates(id: $id) {
      title
      dueDate {
        day
        time
      }
      creator
      class_id
    }
  }
`;
