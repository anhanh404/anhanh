import ChatLists from "@/components/ChatLists";
import Contacts from "@/components/Contacts";

export default function chats() {
    return (
        <div className="main-container">

            <div className="w-1/3 max-lg:w-1/2 max-md:w-full">
                <ChatLists />
            </div>

            <div className="w-2/3 max-lg:w-1/2 max-md:hidden">
                <Contacts />
            </div>

        </div>
    )   
}