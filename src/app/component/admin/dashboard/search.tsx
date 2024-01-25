'use client'
import React, { useState, ChangeEvent, useEffect } from 'react';
import Users from './users';
import { Pagination } from 'antd';
import { UsersProps } from '@/@types/users';
import { paginationUser, searchUser } from '@/apis/user/user';
import { Card, Typography } from '@material-tailwind/react';
import GroupsIcon from '@mui/icons-material/Groups';

const TABLE_HEAD = ["S.no", "Name", "Email", "View", "Status"];

function Search() {
  const [pagination, setPagination] = useState(1);
  const [text, setText] = useState('');
  const [defaultUser,setDefaultUser]=useState([])
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await paginationUser(pagination);
      setDefaultUser(res.data.data)
      setUsers(res.data.data);
    };
    fetchData();
  }, [pagination]);

  const debounceSearch = debounce(async (searchText: string) => {
    try {
      if(searchText.length === 0){
        setUsers(defaultUser);
        return;
      }
      if (searchText.length !== 0 && users.length > 0) {
        const res = await searchUser(searchText);
        setUsers(res.data.data);
        setPagination(1);
      }
    } catch (err) {
      throw err;
    }
  }, 500); 

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value;
    setText(searchText);
    debounceSearch(searchText);
  };

  return (
    <div>
      <div className="mt-5 mx-4 mb-9 flex rounded-lg">
        <input
          type="text"
          className='border-2 w-full p-2 px-5 rounded-lg'
          placeholder="Search using email"
          onChange={handleChange}
        />
      </div>
      <div>
        <Card className="h-full w-full overflow-scroll hide-scrollbar">
          <table className="w-full min-w-max table-auto text-center">
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
        {users.length === 0 ? (
              <tr>
                <td colSpan={TABLE_HEAD.length} className="text-center py-4 text-slate-500 my-5">
                    <GroupsIcon className='text-4xl'/>
                    <p>No users found.</p>
                  
                </td>
              </tr>
            ) : (
              users.map(({ username, email, blocked, id, firstName, lastName }: UsersProps, index: number) => {
                const classes = "p-4 border-b border-blue-gray-50";
                return <Users props={{ username, email, blocked, id, firstName, lastName }} index={index + 1} classes={classes} />;
              })
            )}
        </tbody>
          </table>
        </Card>
      </div>
      {users  && (
        <Pagination
          defaultCurrent={1}
          total={100}
          onChange={(e: number) => {
            setPagination(e);
          }}
          className='text-center my-6 flex justify-center'
        />
      )}
    </div>
  );
}

export default Search;

// Debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: number;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    clearTimeout(timer);

    timer = window.setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}