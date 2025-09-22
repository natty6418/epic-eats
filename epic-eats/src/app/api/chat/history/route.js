import connectDB from "@/db.mjs";
import { options } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { Chat } from "../../../../../Model/Chat.mjs";

export async function GET(){
    const session = await getServerSession(options);
    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    await connectDB();
    const chats = await Chat.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .select({ _id: 1, createdAt: 1, data: { $slice: 1 } });
    const list = chats.map(c => ({
        id: c._id.toString(),
        createdAt: c.createdAt,
        preview: c.data && c.data.length > 0 ? c.data[0].text : "",
    }));
    return new Response(JSON.stringify(list), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

export const dynamic = 'force-dynamic';

