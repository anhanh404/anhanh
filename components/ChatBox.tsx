"use client"
import { format } from "date-fns";
import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation";

const calculateMaxLength = (containerWidth, averageCharWidth) => {
    // Calculate the maximum length based on the container width and average character width
    return Math.floor(containerWidth / averageCharWidth);
};

export const ChatBox = ({chat, currentUser, currentChatId}) => {
    const otherMembers = chat?.members.filter((member) => member._id !== currentUser._id)
    const lastMessage = chat?.messages?.length > 0 && chat?.messages[chat?.messages?.length - 1];
    const seen = lastMessage?.seenBy?.find((member) => member._id === currentUser._id);
    const router = useRouter();
    const [maxLength, setMaxLength] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        // Measure the width of the container
        const containerWidth = containerRef.current.clientWidth;
        // Assuming an average character width (you may need to adjust this based on your font and layout)
        const averageCharWidth = 1.1; // Adjust this value based on your font and layout

        // Calculate the maximum text length based on the container width
        const calculatedMaxLength = calculateMaxLength(containerWidth, averageCharWidth);
        // Set the maximum length state
        setMaxLength(calculatedMaxLength);
    }, [containerRef]);

    return (
        <div 
            className={`chat-box ${chat._id === currentChatId ? "bg-blue-2": ""}`} 
            onClick={() => {
                    router.replace(`/chats/${chat._id}`);
                }
            }
        >
            <div className="chat-info">
                {chat?.isGroup ? (
                    <img 
                        src={chat?.groupPhoto || "/person.jpg"}
                        alt="group photo"
                        className="profilePhoto"
                    />
                ) : (
                    <img 
                        src={otherMembers[0].profileImage|| "/person.jpg"}
                        alt="profile photo"
                        className="profilePhoto"
                    />
                )}

                <div className="flex flex-col gap-1">
                {chat?.isGroup ? (
                    <p className="text-base-bold">{chat?.name}</p>
                ) : (
                    <p className="text-base-bold">{otherMembers[0]?.username}</p>
                )}
                {!lastMessage && <p className="text-small-bold">Started a chat</p>}
                {lastMessage?.photo ? (
                    lastMessage?.sender?._id === currentUser._id ? (
                        <p className="text-small-medium text-grey-3" >You sent a photo</p>
                    ):(
                        <p className= {`last-message ${seen?"text-small-medium text-grey-3":"text-small-bold"}`}>
                            Recieved a photo
                        </p>
                    )
                ):(
                    lastMessage?.sender?._id === currentUser._id ? (
                        <div ref={containerRef}>
                            <p className="text-small-medium text-grey-3">
                                {`You: ${
                                    lastMessage?.text.length > maxLength
                                        ? lastMessage?.text.slice(0, maxLength) + "..."
                                        : lastMessage?.text
                                }`}
                            </p>
                        </div>

                    ) :( 
                        <p className= {`last-message ${seen?"text-small-medium text-grey-3":"text-small-bold"}`}>
                            {
                                lastMessage?.text.length > maxLength
                                    ? lastMessage?.text.slice(0, maxLength) + "..."
                                    : lastMessage?.text
                            }
                        </p>
                    )
                )}

                </div>
            </div>
            <div>
                <p className="text-base-light text-grey-3">
                    {   
                        !lastMessage 
                        ? format(new Date(chat?.createdAt), "p") 
                        : format(new Date(lastMessage?.createAt), "p")
                    }
                </p>
            </div>
        </div>
    )
}