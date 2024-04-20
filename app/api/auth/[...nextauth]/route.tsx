
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/mongodb";
import User from "@/models/User";
import { compare } from "bcryptjs";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            async authorize(credentials, req) {
                if (!credentials.email || !credentials.password){
                    throw new Error("Invalid your email or password");
                }
                await connectToDB();
                const user = await User.findOne({email: credentials.email});
                if( !user || !user?.password) {
                    throw new Error("Invalid your email or password");
                }

                const isMatch = await compare(credentials.password, user.password);

                if( !isMatch) {
                    throw await new Error("Invalid your email or password");
                }
                return user;
            },     
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({session}) {
            const mongodbUser = await User.findOne({email: session.user.email})
            session.user.id = mongodbUser._id.toString();
            session.user = {...session.user, ...mongodbUser._doc};
            return session;
        }
    }
});

export {handler as GET, handler as POST};