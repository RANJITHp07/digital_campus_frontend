import { GET_ASSIGNMENT } from "@/apis/submission/query";
import { submissionClient } from "@/app/providers/ApolloProvider";
import { useQuery } from "@apollo/client";
import { Card, Typography } from "@material-tailwind/react";

const TABLE_HEAD = ["Name", "Attachment", "Mark","Status" ];


function DefaultTable({id}:{id:string}) {
  
  const {data}=useQuery(GET_ASSIGNMENT,{
    client:submissionClient,
    onError(err){
      console.log(id)
      console.log(err)
    },
      variables:{
        id:id
      }
  })

  data && console.log(data)
  const handleEditClick = (event:any) => {
    event.preventDefault();
    // Add your edit logic here
    console.log("Edit clicked");
  };

  return (
    <Card className="h-full w-full">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data.getAllSubmission.map(({ username, attachment, submission }:{username:string,attachment:any,submission:any}, index:number) => {
            const isLast = index === data && data.getAllSubmissionlength - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            return (
              <tr key={username}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {username}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                   <a href="https://firebasestorage.googleapis.com/v0/b/jobee-e1745.appspot.com/o/images%2Fbgprofile.png5a9ba803-9291-4081-9fce-94494b96ccf1?alt=media&token=c2ea3459-3cbd-42c0-aafb-a62fff419b1c"
target="_blank">{ "attachment"}</a>
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    <div className='flex'>
                    <input className='border-b-2 w-9 focus:ouline-none' defaultValue={75}/><p>/100</p>
                    </div>
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                    onClick={handleEditClick}
                  >
                    {submission.status}
                  </Typography>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

export default DefaultTable
