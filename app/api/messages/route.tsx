import { pusherServer } from "@/lib/pusher";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import { connectToDB } from "@/mongodb"
import User from "@/models/User";
export const POST = async (req) => {
    try {
        await connectToDB();
        const body = await req.json();

        const { chatId, currentUserId, text, photo } = body;

        const currenUser = await User.findById(currentUserId);

        const  newMessage = await Message.create({
            chat: chatId,
            sender: currenUser,
            text,
            photo,
            seenBy:[currentUserId],
        });

        const updateChat = await Chat.findByIdAndUpdate (
            chatId,
            {
                $push: {messages: newMessage._id},
                $set: {lastMessageAt: newMessage.createAt}
            },
            {new: true}
        ).populate({
            path: "messages",
            model:Message,
            populate: {
                path: "sender seenBy",
                model: "User",
            }
        }).populate({
            path: "members",
            model: "User",
        }).exec();
        // Trigger a pusher an event for a chat about new message
        await pusherServer.trigger(chatId, "new-message", newMessage);

        return new Response(JSON.stringify(newMessage), {status: 200})

    } catch(err) {
        return new Response("Failed to create new message", {status: 500})
    }
}