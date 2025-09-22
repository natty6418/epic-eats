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
    const recipes = user.savedRecipes || [];
    const searchParams = request.nextUrl.searchParams;
    const search = (searchParams.get('query') || '').trim();
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const limit = Math.max(1, Number(searchParams.get('limit') || 20));
    const start = (page - 1) * limit;
    const end = start + limit;
    const filtered = search
      ? recipes.filter(r => (r.title || '').toLowerCase().includes(search.toLowerCase()))
      : recipes;
    const total = filtered.length;
    const items = filtered.slice(start, end);
    return new Response(JSON.stringify({ items, total, page, limit }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}