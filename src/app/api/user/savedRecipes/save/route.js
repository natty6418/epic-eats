import connectDB from "@/db.mjs";
import { User } from "../../../../../../Model/User.mjs";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

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
    const {recipeId} = data;
    const user = await User.findById(session.user.id);
    if(!user.savedRecipes.includes(recipeId)){
        user.savedRecipes.push(recipeId);
        await user.save();
    }
    return new Response(JSON.stringify({ message: 'Recipe saved successfully' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

