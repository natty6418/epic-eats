import connectDB from "@/db.mjs";
import { Recipe } from "../../../../Model/Recipe.mjs";

export const dynamic = 'force-dynamic';
export async function GET(request) {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');
    
    let sortCriteria = { createdAt: -1 }; // Default: most recent
    
    let recipes;
    
    if (filter === 'trending') {
        // For trending, we need to sort by the length of the likes array
        // MongoDB doesn't support sorting by array length directly, so we'll fetch all and sort in memory
        recipes = await Recipe.find().populate('userId');
        recipes.sort((a, b) => {
            const aLikes = a.likes ? a.likes.length : 0;
            const bLikes = b.likes ? b.likes.length : 0;
            if (aLikes !== bLikes) {
                return bLikes - aLikes; // Sort by likes descending
            }
            return new Date(b.createdAt) - new Date(a.createdAt); // Then by date descending
        });
    } else {
        // For recent and all, use simple sorting
        recipes = await Recipe.find().populate('userId').sort(sortCriteria);
    }
    return new Response(JSON.stringify(recipes), {
        status: 200,
        headers: {
        "Content-Type": "application/json",
        },
    });
}
