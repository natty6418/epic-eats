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
    user.savedRecipes = user.savedRecipes.filter(savedRecipe => savedRecipe.toString() !== recipeId);
    await user.save();
    return new Response(JSON.stringify({ message: 'Recipe removed successfully' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
