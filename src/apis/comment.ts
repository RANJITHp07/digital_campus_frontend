import gql from "graphql-tag";

export const CREATE_COMMENT=gql`
  mutation createComment($comment:CommentInput){
  createComment(comment:$comment){
    message
  }
  }
`

export const GET_ALLCOMMENTS=gql`
 query getAllcomments($id:String!){
   getAllcomments(id:$id){
     privateMessages{
        comment,
        username
        },
     publicMessages{
        comment,
        username
     }
   }
 }
`