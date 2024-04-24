import connectDB from "@/db.mjs";
import { Recipe } from "../../../../../Model/Recipe.mjs";
import { options } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";


export async function GET(request){
    const session = await getServerSession(options);
    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    const userId = session.user.id;
    await connectDB();
    const recipes = await Recipe.find({ userId: userId});
    return new Response(JSON.stringify([...recipes]), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}