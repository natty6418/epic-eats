import connectDB from "@/db.mjs";
import { options } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { Chat } from "../../../../../Model/Chat.mjs";

export async function GET(request, { params }){
    const session = await getServerSession(options);
    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    await connectDB();
    const { id } = params;
    const chat = await Chat.findOne({ _id: id, userId: session.user.id });
    if (!chat) {
        return new Response(JSON.stringify({ error: 'Not Found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    return new Response(JSON.stringify({ id: chat._id, data: chat.data, createdAt: chat.createdAt }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

export const dynamic = 'force-dynamic';

export async function DELETE(request, { params }){
    const session = await getServerSession(options);
    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    await connectDB();
    const { id } = params;
    const result = await Chat.deleteOne({ _id: id, userId: session.user.id });
    if (result.deletedCount === 0) {
        return new Response(JSON.stringify({ error: 'Not Found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    return new Response(null, { status: 204 });
}

