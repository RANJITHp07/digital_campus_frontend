'use client'
import React, { ChangeEvent, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { Pagination, message } from 'antd';
import { GET_CLASSROOMS, SEARCH_CLASSROOMS } from '@/apis/classroom/query';
import { Card, Typography } from '@material-tailwind/react';
import { Classroom } from '@/@types/classroom';
import AllClassroom from './classroom';
import GroupsIcon from '@mui/icons-material/Groups';

const TABLE_HEAD = ["S.no", "Classroom", "Code", "CreatedBy", "Status"];

function SearchClassroom() {
    const [classroom, setClassroom] = useState<Classroom[]>([]);
    const [searchText, setSearchText] = useState('');
    const [search] = useLazyQuery(SEARCH_CLASSROOMS);

    const { data, refetch } = useQuery(GET_CLASSROOMS, {
        variables: { page: 1 },
        onCompleted: (data) => {
            setClassroom(data.getAllUsersClassrooms);
        },
        onError: (err) => {
            console.log(err);
        }
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setSearchText(text);
        debounceSearch(text);
    };

    let timeout: NodeJS.Timeout;
    const debounceSearch = (text: string) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (text.length !== 0 && data.getAllUsersClassrooms.length > 0) {
                search(
                  { variables: { page: 1, text },
                  onCompleted:(data)=>{
                    // console.log(data)
                    setClassroom(data.searchClassroom)
                } });
            } else {
                setClassroom(data.getAllUsersClassrooms);
            }
        }, 300); // Adjust the debounce delay as needed
    };

    const handlePageChange = async (page: number) => {
        const result = await refetch({ page });
        setClassroom(result.data.getAllUsersClassrooms);
    };

    return (
        <div>
            <div className="mt-5 mx-4 mb-9 flex rounded-lg">
                <input type="text" className='border-2 w-full p-2 px-5 rounded-lg' placeholder="Search using code" onChange={handleChange} />
            </div>
            <div>
                <Card className="h-full w-full overflow-scroll hide-scrollbar">
                    <table className="w-full min-w-max table-auto text-center">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head) => (
                                    <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        {classroom.length === 0 ? (
                            <tbody>
                                <tr>
                                    <td colSpan={TABLE_HEAD.length} className="text-center py-4 text-slate-500 my-5">
                                        <GroupsIcon className='text-4xl' />
                                        <p>No classroom found.</p>
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {classroom.map(({ _id, className, classCode, creator, blockClassroom }: Classroom, index: number) => (
                                    <AllClassroom key={_id} props={{ _id, className, classCode, creator, blockClassroom }} index={index} />
                                ))}
                            </tbody>
                        )}
                    </table>
                </Card>
            </div>
            <Pagination defaultCurrent={1} total={100} onChange={handlePageChange} className='text-center mt-4' />
        </div>
    );
}

export default SearchClassroom;
