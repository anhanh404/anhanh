"use client";
import { PersonOutline } from "@mui/icons-material";
import React, {useEffect, useState} from "react";
import { useSession } from "next-auth/react";
import {useForm} from "react-hook-form"
import { CldUploadButton } from "next-cloudinary";
import Loader from "@/components/Loader";

export default function Profile() {
    const {data:session} = useSession();
    const user = session?.user;

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(user) {   
            reset({
                username: user?.username,
                profileImage: user?.profileImage
            })
        }
        setLoading(false);
    }, [user])
    const {
        register, 
        watch, 
        setValue,
        reset,
        handleSubmit, 
        formState: { error }, 
    } = useForm();

    const uploadPhoto = (result) => {
        setValue("profileImage", result?.info?.secure_url);
    }

    const updateUser = async (data) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/users/${user._id}/update`, {
            method: "POST",
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        setLoading(false);
        window.location.reload();
        } 
        catch(err) {
            console.log(err);
        } 
    }

    return loading ? (
        <Loader />
    ) : (
        <div className="profile-page">
            <h1 className="text-heading3-bold">Edit Your Profile</h1>
            <form className="edit-profile" onSubmit={handleSubmit(updateUser)}>
                <div className="input">
                    <input
                        {...register("username",{
                            required: "Username must be required",
                            minLength:{value: 3, message: "Username must be at least"}
                        })}
                        type="text" 
                        placeholder="Username" 
                        className="input-field" />
                    <PersonOutline sx={{color:"#737373"}} />
                </div>
                {error?.username && (
                    <p className="text-red-500">{error.username.message}</p>
                )}
                <div className="flex flex-col gap-5 items-center justify-between">
                    <img 
                        src={ watch("profileImage") || user?.profileImage || "/person.jpg"}
                        alt="profile"
                        className="w-40 h-40 rounded-full"
                     />
                    <CldUploadButton 
                        options={{maxFiles:1}} 
                        onUpload={uploadPhoto}
                        uploadPreset="mfqofhxr"
                    ></CldUploadButton>
                     <p className="text-body-bold">Upload new photo</p>
                     <button className="btn" type="submit">Save Changes</button>
                </div>
            </form>
        </div>
    )
}