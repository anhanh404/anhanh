import User from "@/models/User";
import { connectToDB } from "@/mongodb"
import Chat from "@/models/Chat";
import Message from "@/models/Message";

export const GET = async (req, { params }) => {
    try {
        await connectToDB();
        
        const { userId, query } = params;

        const searchChat = await Chat.find({
            members: userId,
            name: { $regex: query, $options: "i" }
        }).populate({
            path: "members",
            model: User,
        }).populate({
            path: "messages",
            model: Message,
            populate: {
                path: "sender seenBy",
                model: User
            },
        }).exec();
        console.log(searchChat)
        return new Response(JSON.stringify(searchChat), { status: 200 })
    } 
    
    catch(err) {
        console.log(err)
        return new Response("Failed to search chat", {status: 500})
    }
} 