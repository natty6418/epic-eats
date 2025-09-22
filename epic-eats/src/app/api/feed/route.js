import connectDB from "@/db.mjs";
import { Recipe } from "../../../../Model/Recipe.mjs";

export const dynamic = 'force-dynamic';
export async function GET(request) {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const limit = Math.max(1, Number(searchParams.get('limit') || 20));
    const skip = (page - 1) * limit;
    
    let sortCriteria = { createdAt: -1 }; // Default: most recent
    
    let items;
    let total;
    
    if (filter === 'trending') {
        // For trending, we need to sort by the length of the likes array
        // MongoDB doesn't support sorting by array length directly, so we'll fetch all and sort in memory
        const all = await Recipe.find().populate('userId');
        all.sort((a, b) => {
            const aLikes = a.likes ? a.likes.length : 0;
            const bLikes = b.likes ? b.likes.length : 0;
            if (aLikes !== bLikes) {
                return bLikes - aLikes; // Sort by likes descending
            }
            return new Date(b.createdAt) - new Date(a.createdAt); // Then by date descending
        });
        total = all.length;
        items = all.slice(skip, skip + limit);
    } else {
        // For recent and all, use simple sorting
        const [found, count] = await Promise.all([
            Recipe.find().populate('userId').sort(sortCriteria).skip(skip).limit(limit),
            Recipe.countDocuments()
        ]);
        items = found;
        total = count;
    }
    return new Response(JSON.stringify({ items, total, page, limit }), {
        status: 200,
        headers: {
        "Content-Type": "application/json",
        },
    });
}
