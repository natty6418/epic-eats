import connectDB from "@/db.mjs";
import { options } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { GoogleGenerativeAI } from '@google/generative-ai';


const genAI = new GoogleGenerativeAI(process.env.GEN_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "You are a friendly and knowledgeable" + 
    "chef here to guide users through their cooking journey." + 
    " Offer step-by-step instructions, suggest ingredient " + 
    "substitutions, and provide cooking tips tailored to their"+
    " skill level. Use a warm and encouraging tone, celebrate "+
    "their progress, and help troubleshoot any issues. Adapt"+
    " to dietary preferences and offer creative variations, "+
    "ensuring users feel supported and confident in the kitchen."
});

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
    const { history, message } = data || {};

    if (typeof message !== 'string' || message.trim().length === 0){
        return new Response(JSON.stringify({ error: 'Invalid message' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const historyArray = Array.isArray(history)
        ? history
        : Array.isArray(history?.data)
            ? history.data.map((m) => m?.text).filter(Boolean)
            : [];

    const chat = model.startChat({
        history: historyArray.map((text, index) => ({
            parts: [{ text }],
            role: index % 2 === 0 ? "user" : "model"
        })),
    });

    const result = await chat.sendMessage(message);
    return new Response(JSON.stringify({ message: result.response.text() }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
