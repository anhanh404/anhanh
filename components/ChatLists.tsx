"use client";
import {useState, useEffect} from 'react';
import { useSession } from 'next-auth/react';
import Loader from './Loader';
import { ChatBox } from './ChatBox';

const ChatLists = ({currentChatId}) => {
    const {data: sessions} = useSession();

    const [loading, setLoading] = useState(true);
    const [chats, setChats] = useState([]);
    const [search, setSearch] = useState("");
    const currentUser = sessions?.user;

    const getChats = async () => {
        try {
            const res = await fetch(search !== ""
            ?`/api/users/${currentUser._id}/searchChat/${search}`
            :`/api/users/${currentUser._id}`);
            const data = await res.json();
            setChats(data);
            setLoading(false);
        }

        catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if(currentUser) {
            getChats();
        }   
    }, [currentUser, search]);

    return loading? (
        <Loader />
    ) : (
        <div className='chat-list'>
            <input
                className='input-search' 
                placeholder='Search chat...'
                value = {search}
                onChange = {(e) => setSearch(e.target.value)}
            />
            <div className='chats'>
                {chats.map((chat, index) => (
                    <ChatBox key={index} chat={chat} currentChatId={currentChatId} currentUser={currentUser} />
                ))}
            </div>
        </div>
    )
}

export default ChatLists;