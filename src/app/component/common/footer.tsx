import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import Link from 'next/link';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function Footer() {
  return (
    <div className="w-full h-72 mt-8 flex justify-center items-center bg-[#194866]">
        <div>
        <p className='text-white text'>&copy; Designed and created by Ranjith P</p>
        <div className='flex justify-center'>
            <Link href='https://github.com/RANJITHp07'><GitHubIcon className='text-white text-center'/></Link>
            <Link href='https://www.linkedin.com/in/ranjith-p-42a4a1247/'><LinkedInIcon className='text-white text-center mx-4'/></Link>
        </div>
        </div>
    </div>
  );
}

export default Footer;
