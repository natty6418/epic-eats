import connectDB from "@/db.mjs";
import { Recipe } from "../../../../../Model/Recipe.mjs";
import { options } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

export async function GET(request,{params}){
    await connectDB();
    const { id } = params;
    const recipe = await Recipe.findById(id).populate('userId');
    if (!recipe) {
        return new Response(JSON.stringify({ error: 'Recipe not found' }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    return new Response(JSON.stringify(recipe), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
export async function PUT(request, { params }) {
    await connectDB();
    const { id } = params;
    const data = await request.json();
    const recipe = await Recipe.findByIdAndUpdate(id, data, { new: true });
    if (!recipe) {
        return new Response(JSON.stringify({ error: 'Recipe not found' }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    return new Response(JSON.stringify(recipe), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export async function DELETE(request, { params }) {
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
    const recipeToDelete = await Recipe.findById(id);
    if (!recipeToDelete) {
        return new Response(JSON.stringify({ error: 'Recipe not found' }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    if(recipeToDelete.userId.toString() !== session.user.id){
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    const recipe = await Recipe.findByIdAndDelete(id);
    if (!recipe) {
        return new Response(JSON.stringify({ error: 'Recipe not found' }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    return new Response(JSON.stringify(recipe), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}