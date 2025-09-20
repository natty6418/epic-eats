import connectDB from "@/db.mjs";
import { Recipe } from "../../../../../../Model/Recipe.mjs";
import { options } from "../../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

export const dynamic = 'force-dynamic';

export async function POST(request, { params }) {
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

    const { id } = params;
    const userId = session.user?.id;

    if (!userId) {
        return new Response(JSON.stringify({ error: 'User ID not found in session' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    try {
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return new Response(JSON.stringify({ error: 'Recipe not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Check if user already liked the recipe
        if (recipe.likes.includes(userId)) {
            return new Response(JSON.stringify({ error: 'Recipe already liked' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Add user to likes array
        recipe.likes.push(userId);
        await recipe.save();

        return new Response(JSON.stringify({ 
            message: 'Recipe liked successfully',
            likes: recipe.likes 
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error liking recipe:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
