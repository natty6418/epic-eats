import connectDB from "@/db.mjs";
import { User } from "../../../../../Model/User.mjs";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

export async function POST(request) {
    const session = await getServerSession(options);
    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    await connectDB();
    const data = await request.json();
    const { currentUserId, userToFollowId } = data;
    const currentUser = await User.findById(currentUserId);
    const userToFollow = await User.findById(userToFollowId);
    if (!userToFollow) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    currentUser.following.push(userToFollowId);
    userToFollow.followers.push(currentUserId);
    await currentUser.save();
    await userToFollow.save();
    return new Response(JSON.stringify({ message: 'User followed successfully' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
    