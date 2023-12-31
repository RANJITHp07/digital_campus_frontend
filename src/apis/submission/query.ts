import gql from "graphql-tag";

export const GET_POLLING = gql`
  query getPolling($id: ID!) {
    getPolling(id: $id) {
      polling {
        polling
      }
    }
  }
`;

export const GET_ASSIGNMENT = gql`
  query getAllSubmission($id: String) {
    getAllSubmission(id: $id) {
      quizAnswers
      user_id
      username
      attachment {
        content
      }
      submission {
        status
        grade
      }
    }
  }
`;
