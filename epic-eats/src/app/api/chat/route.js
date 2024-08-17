import connectDB from "@/db.mjs";
import { options } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { GoogleGenerativeAI } from '@google/generative-ai';


const genAI = new GoogleGenerativeAI(process.env.GEN_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    const {history, message} = data;
    const chat = model.startChat({
        history: history.map((message, index) => ({ parts: [{text:message}], role: index % 2 === 0 ? "user" : "model" })),
    });
    const result = await chat.sendMessage(message);
    return new Response(JSON.stringify({ message: result.response.text() }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
