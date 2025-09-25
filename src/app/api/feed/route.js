import connectDB from "@/db.mjs";
import { Recipe } from "../../../../Model/Recipe.mjs";
import { User } from "../../../../Model/User.mjs";

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
        const [found, count] = await Promise.all([
            Recipe.find({}, 'title image description createdAt userId likes likesCount')
                .sort({ likesCount: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('userId')
                .lean(),
            Recipe.countDocuments()
        ]);
        items = found;
        total = count;
    } else {
        // For recent and all, use simple sorting
        const [found, count] = await Promise.all([
            Recipe.find().populate('userId').sort(sortCriteria).skip(skip).limit(limit).lean(),
            Recipe.countDocuments()
        ]);
        // Ensure likesCount is consistent if missing or stale
        items = found.map(doc => ({
            ...doc,
            likesCount: typeof doc.likesCount === 'number' ? doc.likesCount : (Array.isArray(doc.likes) ? doc.likes.length : 0),
        }));
        total = count;
    }
    return new Response(JSON.stringify({ items, total, page, limit }), {
        status: 200,
        headers: {
        "Content-Type": "application/json",
        },
    });
}
