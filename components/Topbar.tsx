"use client";
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Logout } from '@mui/icons-material';
import { signOut, useSession } from 'next-auth/react';

const Topbar = () => {
    const {data:session} = useSession();
    const user = session?.user;
    const pathname = usePathname();
    const handleLogout = async () => {
        signOut({callbackUrl:"/"})
    }
    return (
        <div className='topbar'>
            <Link href="/chats" >
                <img src='/logo.png' className='logo' alt='logo'/>
            </Link>
            <div className='menu'>
                <Link 
                    href="/chats" 
                    className={`${pathname === "/chats" ? "text-red-1":""} text-heading4-bold`}
                >
                    Chats
                </Link>

                <Link 
                    href="/contacts"
                    className={`${pathname === "/contacts" ? "text-red-1":""} text-heading4-bold`}
                >
                    Contacts
                </Link>

                <Logout 
                    sx={{color:"#737373", cursor:"pointer"}} 
                    onClick={handleLogout} 
                />
                <Link href="/profile">
                    <img 
                        src={user?.profileImage || "/person.jpg"} 
                        alt='profile'
                        className='profilePhoto'
                    />  
                </Link>
                
            </div>
        </div>
    )
}

export default Topbar;