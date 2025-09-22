import connectDB from "@/db.mjs";
import { Comment, validateComment } from "../../../../Model/Comment.mjs";
import { options } from "../auth/[...nextauth]/options";
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
    const { error } = validateComment(data);
    if (error) {
        return new Response(JSON.stringify({ error: error.details[0].message }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    const comment = new Comment({
        userId: session.user.id,
        recipeId: recipeId,
        text,
        createdAt: new Date(),
    });
    await comment.save();
    const recipe = await Recipe.findById(recipeId);
    recipe.comments.push(comment);
    await recipe.save();
    return new Response(JSON.stringify(comment), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export const dynamic = 'force-dynamic';
export async function GET(request){
    await connectDB();
    const session = await getServerSession(options);
    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    const searchParams = request.nextUrl.searchParams;
    const recipeId = searchParams.get('recipeId');
    if (!recipeId) {
        return new Response(JSON.stringify({ error: 'recipeId is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const limit = Math.max(1, Number(searchParams.get('limit') || 20));
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        Comment.find({ recipeId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Comment.countDocuments({ recipeId })
    ]);
    return new Response(JSON.stringify({ items, total, page, limit }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}