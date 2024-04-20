"use client";
import React from "react";
import { EmailOutlined, LockOutlined, PersonOutline } from "@mui/icons-material";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation'
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

const Form = ({ type }) => {
    const router = useRouter();
    const onSubmit = async (data: any) => {
        if(type === "register") {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            });

            if(res.ok) {
                console.log("ok")
                router.push("/")  
            }
            if(res.error) {
                toast.error("Somthing went wrong!");
            }
        }

        if (type == "login") {
            const res = await signIn("credentials", {
                ...data,
                redirect: false,
            });

            if(res.ok) {
                console.log("ok")
                router.push("/chats")  
            }
            if(res.error) {
                toast.error("Invalid your email or password!");
            }
        }
    }
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    return (
        <div className="auth">
            <div className="content">
                <img alt="logo" className="logo" src="/logo.png" />
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        {type === 'register' && (
                            <div className="input">
                                <input
                                {...register("username", {
                                    required: "Username is required",
                                    minLength: { value: 3, message: "Username must be at least 3 characters" }
                                })}
                                type="text"
                                placeholder="Username"
                                className="input-field"
                                />
                                <PersonOutline sx={{ color: "#737373" }} />
                            </div>
                        )}
                        {errors.username && (
                            <p className="text-red-500">{errors.username.message}</p>
                        )}
                    </div>

                    <div>
                        <div className="input">
                            <input
                                defaultValue=""
                                {...register("email", { required: "Email is required" })}
                                type="email"
                                placeholder="Email"
                                className="input-field"
                            />
                            <EmailOutlined sx={{ color: "#737373" }} />
                        </div>
                        {errors.email && (
                            <p className="text-red-500">{errors.email.message}</p>
                        )}
                    </div>
                    
                    <div>
                        <div className="input">
                            <input
                                defaultValue=""
                                {...register("password", {
                                    required: "Password is required",
                                    validate: (value) => {
                                        if (value.length < 8) {
                                            return "Password must be at least 8 characters";
                                        }
                                    },
                                })}
                                type="password"
                                placeholder="Password"
                                className="input-field"
                            />
                            <LockOutlined sx={{ color: "#737373" }} />
                        </div>
                        {errors.password && (
                            <p className="text-red-500">{errors.password.message}</p>
                        )}
                    </div>
                    
                    <button className="button" type="submit">
                        {type === "register" ? "Join Free" : "Let&apos;s Chat" }
                    </button>
                </form>

                {type === "register" ? (
                    <Link href="/">
                        <p className="text-center">Already have an account? Sign In Here</p>
                    </Link>
                ) : (
                    <Link href="/register">
                        <p className="text-center">Dont have an account? Register Here!</p>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Form;
