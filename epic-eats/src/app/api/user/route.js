import connectDB from "@/db.mjs";
import { User } from "../../../../Model/User.mjs";

export async function GET(request){
    await connectDB();
    const query = (request.nextUrl.searchParams.get('q'))?.trim();
    if (query) {
        const users = await User.find({ username: { $regex: query, $options: 'i' } }).select({ username: 1, _id: 1, profilePic: 1, followers: 1});
        return new Response(JSON.stringify(users), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    const users = await User.find();
    return new Response(JSON.stringify(users), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
