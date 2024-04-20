"use client";
import {useState, useEffect, useRef} from 'react';
import Loader from './Loader';
import Link from 'next/link';
import { AddPhotoAlternate } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { CldUploadButton } from 'next-cloudinary';
import MessageBox  from './MessageBox';
import { pusherClient } from '@/lib/pusher';

export default function chatDetails({chatId}) {
    const [loading, setLoading] = useState(true);
    const [chat, setChat] = useState([])
    const [otherMembers, setOtherMembers] = useState([])
    const [text, setText] = useState("");
    const {data: session} = useSession();
    const currentUser = session?.user

    const getChatDetails = async () => {
        try {
            const res = await fetch(`/api/chats/${chatId}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const data = await res.json();
            setChat(data);
            setOtherMembers(data?.members?.filter(member => member._id !== currentUser._id));
            setLoading(false)
        } catch {

        }
    }
    useEffect(() => {
        if (currentUser && chatId)
            getChatDetails();
    }, [currentUser, chatId]);

    const sendText = async () => {
        try {
            if(text) {
                const res = await fetch("/api/messages", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        chatId,
                        currentUserId: currentUser._id,
                        text,
                    }),
                });
                if(res.ok)
                    setText("");
            }
            
        } catch(err) {
            console.log(err)
        }
    }

    const sendPhoto = async (result) => {
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chatId,
                    currentUserId: currentUser._id,
                    photo: result?.info?.secure_url,
                }),
            });

            
        } catch(err) {
            console.log(err)
        }
    }

    
    useEffect(() => {
        pusherClient.subscribe(chatId)
        const handleMessage = async (newMessage) => {
            setChat((prevChat) => {
                return {
                    ...prevChat,
                    messages: [...prevChat.messages, newMessage]
                }
            })
        }
        pusherClient.bind("new-message", handleMessage)
        return () => {
            pusherClient.unsubscribe(chatId)
            pusherClient.unbind("new-message", handleMessage)
        }
    }, [chatId])

    const bottomRef = useRef(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end", // Scroll to the end of the container
                inline: "end", // Align the bottom of the element with the bottom of the container
                // Leave 50 pixels of space from the bottom of the container
                margin: "0px 0px -50px 0px"
            });
        }
    }, [chat?.messages]);
    
    

    return loading ? <Loader /> : (
        <div className='chat-details'>
            <div className='chat-header' >
                {chat?.isGroup ? (
                    <Link 
                        href={`/chats/${chatId}/group-info`} 
                        className='flex flex-row gap-2 items-center'
                    >
                        <img 
                            src={chat?.groupPhoto || "/person.jpg"} 
                            className='profilePhoto'
                            alt='groupPhoto'
                        />
                        <div className='mt-1'>
                            <p>{chat?.name}</p>
                            <p className='text-sm font-normal -mt-1'>
                                Members: {chat?.members.length}
                            </p> 
                        </div>
                        
                    </Link>
                ) : (
                    <div className='flex flex-row gap-2 items-center'>
                        <img 
                            src={otherMembers[0].profileImage || "/person.jpg"}
                            alt= "profile photo"
                            className='profilePhoto'
                        />
                        <p>{otherMembers[0]?.username}</p>
                    </div>
                )}
            </div>
            <div className='chat-body text-black' style={{ overflow: 'auto' }}>
                {chat?.messages.map((message, index) => (
                    <MessageBox
                        key={index}
                        message={message}
                        currentUser={currentUser}
                    />
                ))}
                <div ref={bottomRef} />
            </div>

            
            <div className='send-message'>
                <div className='prepare-message'>
                    <CldUploadButton 
                        options={{maxFiles:1}} 
                        onUpload={sendPhoto}
                        uploadPreset="mfqofhxr"
                    >
                    <AddPhotoAlternate 
                        sx={{fontSize:"35px", 
                        color:"#737373", 
                        cursor:"pointer", 
                        "&:hover":{color:"red"}}}
                    />
                    </CldUploadButton>
                    <input 
                        type='text' 
                        placeholder='Write a message...'
                        value = {text}
                        onChange = {(e) => setText(e.target.value)}
                        required
                        className='input-message'
                    />                    
                </div>
                <div>
                    <img 
                        src='/send.jpg'
                        alt="send"
                        className='send-icon'
                        onClick={sendText}
                    />
                </div>
            </div>
            
        </div>
    )
}