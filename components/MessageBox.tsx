import { format } from "date-fns"

const MessageBox = ({ message, currentUser }) => {
    return message?.sender?._id !== currentUser._id ? (
        <div className="message-box">
            <img 
                src={message?.sender?.profileImage || "/person.jpg"}
                alt="profile photo"
                className="profilePhoto"
            />

            <div className="message-info">
                <p className="text-small-bold">
                    {message?.sender?.username + ' '}
                    {format(new Date(message?.createAt), "p")}
                </p>
                {message?.text ? (
                    <p className="message-text">{message?.text}</p>
                ) : (
                    <img 
                        className="message-photo" 
                        alt="message photo" 
                        src={message?.photo}
                    />
                )}
            </div>
        </div>
    ) : (
        <div className="message-box justify-end">
            <div className="message-info items-end">
                <p className="text-small-bold">
                    {format(new Date(message?.createAt), "p")}
                </p>
                {message?.text ? (
                    <p className="message-text-sender">{message?.text}</p>
                ) : (
                    <img 
                        className="message-photo" 
                        alt="message" 
                        src={message?.photo} 
                    />
                )}
            </div>
        </div>
    )   
}

export default MessageBox;