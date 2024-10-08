import connectDB from "@/db.mjs";
import { User } from "../../../../../Model/User.mjs";
import { options } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

export const dynamic = 'force-dynamic';
export async function GET(request) {
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
    const user = await User.findById(userId)
    .populate({
      path: 'savedRecipes',
      populate: {
        path: 'userId',
        model: 'User'
      }
    });
    const recipes = user.savedRecipes;
    const search = request.nextUrl.searchParams.get('query')?.trim();
    if(search){
        const filteredRecipes = recipes.filter(recipe => recipe.title.toLowerCase().includes(search.toLowerCase()));
        return new Response(JSON.stringify(filteredRecipes), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    return new Response(JSON.stringify(recipes), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });    
}