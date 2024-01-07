import gql from "graphql-tag";

export const CREATE_COMMENT = gql`
  mutation createComment($comment: CommentInput) {
    createComment(comment: $comment) {
      message
    }
  }
`;
