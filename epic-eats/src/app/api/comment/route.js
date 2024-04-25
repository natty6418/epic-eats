import connectDB from "@/db.mjs";
import { Comment } from "../../../../Model/Comment.mjs";
import { options } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { Recipe } from "../../../../Model/Recipe.mjs";

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
    const {recipeId, text} = data;
    const comment = new Comment({
        user: session.user.id,
        recipe: recipeId,
        text
    });
    await comment.save();
    const recipe = await Recipe.findById(recipeId);
    recipe.comments.push(comment);
    return new Response(JSON.stringify({ message: 'Comment added successfully' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}