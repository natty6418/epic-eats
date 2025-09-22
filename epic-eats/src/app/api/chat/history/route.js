import connectDB from "@/db.mjs";
import { options } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { Chat } from "../../../../../Model/Chat.mjs";

export async function GET(request){
    const session = await getServerSession(options);
    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const limit = Math.max(1, Number(searchParams.get('limit') || 20));
    const skip = (page - 1) * limit;
    const [chats, total] = await Promise.all([
        Chat.find({ userId: session.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select({ _id: 1, createdAt: 1, title: 1, data: { $slice: 1 } }),
        Chat.countDocuments({ userId: session.user.id })
    ]);
    const items = chats.map(c => ({
        id: c._id.toString(),
        createdAt: c.createdAt,
        title: c.title && c.title.trim().length ? c.title : (c.data && c.data.length > 0 ? c.data[0].text : ""),
        preview: c.data && c.data.length > 0 ? c.data[0].text : "",
    }));
    return new Response(JSON.stringify({ items, total, page, limit }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

export const dynamic = 'force-dynamic';

