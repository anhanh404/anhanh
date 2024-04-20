"use client";
import { GroupOutlined, PersonOutline } from "@mui/icons-material";
import React, {useEffect, useState} from "react";
import { useParams } from "next/navigation";
import {useForm} from "react-hook-form"
import { CldUploadButton } from "next-cloudinary";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";

export default function GroupInfo() {

    const [loading, setLoading] = useState(true);
    const [chat, setChat] = useState({})

    const {chatId} = useParams();

    const getChatDetails = async () => {
        try {
            const res = await fetch(`/api/chats/${chatId}`);
            const data = await res.json();
            setChat(data);
            setLoading(false);
            reset({
                name: data?.name,
                groupPhoto: data?.groupPhoto
            })
        } catch(err) {
            console.log(err);
        }
    }
    useEffect(() => {
    if (chatId) {
      getChatDetails();
    }
  }, [chatId]);

    const {
        register, 
        watch, 
        setValue,
        reset,
        handleSubmit, 
        formState: { errors }, 
    } = useForm();

    const uploadPhoto = (result: CldUploadResult) => {
        setValue("groupPhoto", result?.info?.secure_url);
    }
    const router = useRouter();
    const updateGroupChat = async (data) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/chats/${chatId}/update`, {
                method: "POST",
                header: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            setLoading(false);
        } 
        catch(err) {
            console.log(err);
        } 
    }

    return loading ? (
        <Loader />
    ) : (
        <div className="profile-page">
            <h1 className="text-heading3-bold">Edit Group Info</h1>
            <form className="edit-profile" onSubmit={handleSubmit(updateGroupChat)}>
                <div className="input">
                    <input
                        {...register("name",{
                            required: "Group chat name is required",
                        })}
                        type="text" 
                        placeholder="Group name" 
                        className="input-field" />
                    <GroupOutlined sx={{color:"#737373"}} />
                </div>
                {error?.name && (
                    <p className="text-red-500">{error.name.message}</p>
                )}
                <div className="flex flex-col gap-5 items-center justify-between">
                    <img 
                        src={ watch("groupPhoto") || "/person.jpg"}
                        alt="profile"
                        className="w-40 h-40 rounded-full"
                     />
                    <CldUploadButton 
                        options={{maxFiles:1}} 
                        onUpload={uploadPhoto}
                        uploadPreset="mfqofhxr"
                    ></CldUploadButton>

                    <div className="flex flex-wrap gap-3">
                        {chat?.member?.map((member, index) => (
                            <p className="selected-contact" key={index}>{member.usename}</p>
                        ))}
                    </div>
                     <p className="text-body-bold">Upload new photo</p>
                     <button className="btn" type="submit">Save Changes</button>
                </div>
            </form>
        </div>
    )
}
