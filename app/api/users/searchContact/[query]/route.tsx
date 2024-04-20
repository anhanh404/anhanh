
import { connectToDB } from "@/mongodb";
import User from "@/models/User";

export const GET = async (req, { params }) => {
    try {
        await connectToDB();

        const { query } = params;

        const searchContacts = await User.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        });

        return new Response(JSON.stringify(searchContacts), { status: 200 });
    } catch (err) {
        const errorMessage = { error: "Failed to search contact" };
        return new Response(JSON.stringify(errorMessage), { status: 500 });
    }
}
