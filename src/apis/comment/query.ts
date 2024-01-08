import gql from "graphql-tag";

export const GET_ALLCOMMENTS = gql`
  query getAllcomments($id: String!) {
    getAllcomments(id: $id) {
      privateMessages {
        comment
        username
      }
      publicMessages {
        comment
        username
      }
    }
  }
`;
