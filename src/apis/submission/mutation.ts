import gql from "graphql-tag";

export const CREATE_SUBMISSION = gql`
  mutation createSubmission($submission: SubmissionInput) {
    createSubmission(submission: $submission) {
      message
    }
  }
`;
