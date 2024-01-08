import gql from "graphql-tag";

export const CREATE_SUBMISSION = gql`
  mutation createSubmission($submission: SubmissionInput) {
    createSubmission(submission: $submission) {
      message
      marks
    }
  }
`;

export const UPDATE_GRADE=gql`
 mutation updateGrade($update:GradeInput){
  updateGrade(update:$update){
   message
  }
 }
`