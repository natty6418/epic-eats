import connectDB from "@/db.mjs";
import { Recipe } from "../../../../../Model/Recipe.mjs";
import { options } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

export const dynamic = 'force-dynamic';
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
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const limit = Math.max(1, Number(searchParams.get('limit') || 20));
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        Recipe.find({ userId: userId }).skip(skip).limit(limit),
        Recipe.countDocuments({ userId: userId })
    ]);
    return new Response(JSON.stringify({ items, total, page, limit }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}