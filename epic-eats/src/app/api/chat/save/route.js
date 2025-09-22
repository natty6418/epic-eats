import connectDB from "@/db.mjs";
import { options } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { Chat, validateChat } from "../../../../../Model/Chat.mjs";

export async function POST(request){
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
    const { id, data: chatData } = data || {};
    const { error } = validateChat({ data: chatData });
    if (error) {
        return new Response(JSON.stringify({ error: error.details[0].message }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    let chat;
    if (id) {
        chat = await Chat.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            { data: chatData },
            { new: true }
        );
        if (!chat) {
            return new Response(JSON.stringify({ error: 'Not Found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } else {
        chat = new Chat({
            userId: session.user.id,
            data: chatData,
            createdAt: new Date(),
        });
        await chat.save();
    }
    return new Response(JSON.stringify({ id: chat._id.toString(), createdAt: chat.createdAt }), {
        status: 201,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export const dynamic = 'force-dynamic';

