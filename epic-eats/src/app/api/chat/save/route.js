import connectDB from "@/db.mjs";
import { options } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { Chat, validateChat } from "../../../../../Model/Chat.mjs";
import { GoogleGenerativeAI } from '@google/generative-ai';

async function generateTitleFromMessages(chatData){
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEN_API_KEY);
        const titleModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // Use up to the first 6 messages (≈ 3 back-and-forths) for context
        const transcript = (Array.isArray(chatData) ? chatData : []).slice(0, 6)
            .map(m => `${m.sender === 'assistant' ? 'Assistant' : 'User'}: ${m.text}`)
            .join('\n');
        const prompt = [
            'Create a concise, specific 3-6 word title for this cooking chat. No ending punctuation. No quotes. Capture the main topic.',
            transcript
        ].filter(Boolean).join('\n');
        const titleResp = await titleModel.generateContent(prompt);
        const raw = titleResp.response.text().trim();
        return raw.split('\n')[0].slice(0, 60) || 'unknown chat';
    } catch {
        return (chatData?.[0]?.text || 'unknown chat').slice(0, 60);
    }
}

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
        console.log('Updating chat', id);
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
        // Regenerate title during the first ~3 dialogues (<= 6 messages), then freeze
        if (Array.isArray(chatData) && chatData.length > 0 && chatData.length <= 6) {
            const nextTitle = await generateTitleFromMessages(chatData);
            if (nextTitle && nextTitle !== chat.title) {
                await Chat.updateOne({ _id: chat._id }, { title: nextTitle });
                chat.title = nextTitle;
                console.log('Updated title', nextTitle);
            }
        }
    } else {
        chat = new Chat({
            userId: session.user.id,
            data: chatData,
            createdAt: new Date(),
        });
        // Generate initial title for a new chat
        chat.title = await generateTitleFromMessages(chatData);
        console.log('Generated initial title', chat.title);
        await chat.save();
    }
    return new Response(JSON.stringify({ id: chat._id.toString(), createdAt: chat.createdAt, title: chat.title }), {
        status: 201,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export const dynamic = 'force-dynamic';

