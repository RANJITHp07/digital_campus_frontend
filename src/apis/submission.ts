import gql from "graphql-tag";

export const CREATE_SUBMISSION=gql`
 mutation createSubmission($submission: SubmissionInput){
    createSubmission(submission:$submission){
      message
    }
    
 }
`

export const GET_POLLING=gql`
query getPolling($id:ID!){
   getPolling(id:$id){
    polling{
     polling
    }
   }
}
`

export const GET_ASSIGNMENT=gql`
 query getAllSubmission($id:String){
  getAllSubmission(id:$id){
    username,
    attachment{
     content
    },
    submission{
     status
     grade
    }
  }
 }
`