import connectDB from "@/db.mjs";
import { Recipe } from "../../../../../../Model/Recipe.mjs";
import mongoose from "mongoose";
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

        // Check if user has liked the recipe
        if (!recipe.likes.includes(userId)) {
            return new Response(JSON.stringify({ error: 'Recipe not liked' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Remove user and set likesCount = likes.length atomically (pipeline update)
        const updated = await Recipe.findOneAndUpdate(
            { _id: id },
            [
                { $set: { likes: {
                    $filter: {
                        input: "$likes",
                        as: "lid",
                        cond: { $ne: [ "$$lid", new mongoose.Types.ObjectId(userId) ] }
                    }
                } } },
                { $set: { likesCount: { $size: "$likes" } } }
            ],
            { new: true, returnDocument: 'after', projection: { likes: 1, likesCount: 1 } }
        );

        return new Response(JSON.stringify({ 
            message: 'Recipe unliked successfully',
            likes: updated.likes,
            likesCount: updated.likesCount
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error unliking recipe:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
