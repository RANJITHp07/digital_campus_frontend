import gql from "graphql-tag";


export const CREATE_ASSIGNMENT = gql`
  mutation createAssignment($assignment: AssignmentInput) {
    createAssignment(assignment:$assignment) {
      title,
        createdAt,
        assignmentType,
        _id
    }
  }
`;


export const EDIT_ASSIGNMENT = gql`
  mutation updateAssignment( $id:String!,$update: AssignmentInput) {
    updateAssignment(id:$id,update:$update) {
      title,
    }
  }
`;


export const DELETE_ASSIGNMENT = gql`
  mutation deleteAssignment($id:String!) {
    deleteAssignment(id:$id) {
      title,
        createdAt,
        assignmentType,
        _id,
        mainTopic
    }
  }
`;

export const FETCH_ASSIGNMENT_DETAILS = gql`
  query getAllassignment($id: String!) {
    getAllassignment(id: $id) {
       title,
       assignmentType,
    }
  }
`;

export const FETCH_MAINTOPIC = gql`
  query getdistinctmainTopic{
    getdistinctmainTopic {
       mainTopic
    }
  }
`;

export const GROUPED_ASSIGNMENT=gql`
   query getgroupedAssignment($id: String!) {
    getgroupedAssignment(id: $id) {
       _id,
       assignments{
        title,
        createdAt,
        assignmentType,
        _id
       }
    }
  }
`

export const ASSIGNMENT_DETAILS=gql`
   query getOneassignment($id: String!) {
    getOneassignment(id: $id) {
       title,
       instruction,
       attachment{
       content
       type
       }
       assignmentType
    }
  }
`

export const EDIT_ASSIGNMENT_DETAILS=gql`
   query getOneassignment($id: String!) {
    getOneassignment(id: $id) {
       title,
       instruction,
       attachment{
       content
       type
       }
       mainTopic
       creator
       class_id
  students
  dueDate{
   day,
   time
  }
       assignmentType
    }
  }
`
