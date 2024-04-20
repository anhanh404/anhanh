"use client"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react";
import ChatLists from "@/components/ChatLists";
import ChatDetails from "@/components/ChatDetails";
import { useEffect } from "react";

export default function ChatPage() {
    const {chatId} = useParams();
    
    const {data:session} = useSession();
    const currentUser = session?.user;

    const seenLastMessages = async () => {
        try {
            await fetch(`/api/chats/${chatId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    currentUserId: currentUser._id,
                })
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(currentUser && chatId)
            seenLastMessages();
    }, [currentUser, chatId])
    return (

    <div className="main-container">
        <div className="w-1/3 max-lg:hidden"><ChatLists currentChatId={chatId} /></div>
        <div className="w-2/3 max-lg:w-full">
            <ChatDetails 
                chatId={chatId}
            />
        </div>
    </div>
    )   
}
