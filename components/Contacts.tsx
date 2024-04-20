"use client";
import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loader from './Loader';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';


export default function Contacts() {
    
    const [loading, setLoading] = useState(true);
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState("");
    const {data:session} = useSession();
    const currentUser = session?.user;
    const getContacts = async () => {
        try {
            const res = await fetch(search !== "" ? `/api/users/searchContact/${search}`:"/api/users");
            const data = await res.json();
            setContacts(data.filter((contact) => contact._id !== currentUser._id));
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        if(currentUser) {
            getContacts();
        }

    }, [currentUser, search])

    // Select contact
    const [selectedContacts, setSelectedContacts] = useState([]);
    const router = useRouter();
    let contactName;
    if (selectedContacts.length > 0)
        contactName = selectedContacts[0].username;
    const createChat = async () => {
        try {
            if(selectedContacts.length > 0) {
                const res = await fetch("/api/chats", {
                    method:"POST",
                    body: JSON.stringify({
                        currentUserId: currentUser._id,
                        members: selectedContacts.map((contact) => contact._id),
                        isGroup,
                        name: isGroup ? name : contactName
                    })
                })
        
                const chat = await res.json();
        
                if(res.ok) {
                    router.push(`chats/${chat._id}`);
                }
            }

        } catch(err){}
        
    }

    const handleSelect = (contact) => {
        if (selectedContacts.includes(contact)) {
            setSelectedContacts((prevSelectedContacts) => prevSelectedContacts.filter((item) => item !== contact) )
        } else {
            setSelectedContacts((prevSelectedContacts) => [...prevSelectedContacts, contact]);
        }
    }

    //Add Group chat
    const [name, setName] = useState("");
    const isGroup = selectedContacts.length > 1;
    return loading ? (
        <Loader />
    ):(
        <div className='create-chat-container'>
            <input 
                placeholder='Search contact...'
                className='input-search'
                value = {search}
                onChange={(e) => {setSearch(e.target.value)}}
            />

            <div className="contact-bar">
                <div className='contact-list'>
                    <p className='text-body-bold'>Select or Deselect</p>
                    {contacts.map((user, index) => (
                        <div key={index} className="contact" onClick={() => handleSelect(user)}>
                            {selectedContacts.find((item) => item == user) ? (
                                <CheckCircle sx={{color:"red"}} />
                            ) : (
                                <RadioButtonUnchecked />
                            )}
                            <img 
                                src={user.profileImage || "/person.jpg"} 
                                alt="profile"
                                className='profilePhoto'
                            />
                            <p className='text-base-bold'>{user.username}</p>
                        </div>
                    ))}
                </div>
                <div className='create-chat'>
                    {isGroup && (
                        <>
                            <div className='flex flex-col gap-3'>
                                <p className='text-body-bold'>Group Chat Name</p>
                                <input 
                                    placeholder='Enter a group chat name...'
                                    value={name}
                                    className='input-group-name'
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className='flex flex-col gap-3'>
                                <p className='text-body-bold'>Members</p>
                                <div className='flex -flex-wrap gap-3'>
                                    {selectedContacts.map((contact, index) => (
                                        <p className='selected-contact' key={index}>
                                            {contact.username}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                    
                    <button className='btn' onClick={() => createChat()}>FIND OR START A NEW CHAT</button>
                </div>
            </div>
        </div>
    )
}