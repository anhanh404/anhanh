import { connectToDB } from "@/mongodb"
import Chat from "@/models/Chat";
import User from "@/models/User";

export const POST = async (req) => {
    try {
        await connectToDB();
        const body = await req.json();
        const { currentUserId, members, isGroup, name } = body;

        const query = isGroup
        ? { isGroup, name, members: [currentUserId, ...members] }
        : { members: { $all: [currentUserId, ...members], $size: 2 } };

        let chat = await Chat.findOne(query);
        if (!chat) {
        const chatData = isGroup
            ? query
            : {name, members: [currentUserId, ...members]};

        chat = await new Chat(chatData).save();

        const updateAllMembers = chat.members.map(async (memberId) => {
            await User.findByIdAndUpdate(
            memberId,
            {
                $addToSet: { chats: chat._id },
            },
            { new: true }
            );
        });
             
            Promise.all(updateAllMembers)    
        }
        return new Response(JSON.stringify(chat), {status: 200});
    }
    catch (err) {
        console.error(err);
        return new Response("Failed to create a new chat", {status: 500})
    }
}