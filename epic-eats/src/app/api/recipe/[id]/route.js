import connectDB from "@/db.mjs";
import { Recipe } from "../../../../../Model/Recipe.mjs";
import { options } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

export const dynamic = 'force-dynamic';
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
    // Normalize ingredients to array of strings for backward compatibility
    const doc = recipe.toObject ? recipe.toObject() : JSON.parse(JSON.stringify(recipe));
    if (Array.isArray(doc.ingredients)) {
        doc.ingredients = doc.ingredients.map((item) => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object') {
                if (typeof item.ingredient === 'string' || typeof item.quantity === 'string') {
                    const left = item.ingredient || '';
                    const right = item.quantity ? ` – ${item.quantity}` : '';
                    return `${left}${right}`.trim();
                }
                // Handle mistakenly spread string objects with numeric keys
                const keys = Object.keys(item).filter(k => /^\d+$/.test(k)).sort((a,b)=>Number(a)-Number(b));
                if (keys.length) {
                    return keys.map(k => item[k]).join('');
                }
            }
            return '';
        }).filter(Boolean);
    }
    return new Response(JSON.stringify(doc), {
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
    const ingredients = Array.isArray(data.ingredients)
        ? data.ingredients.map((item) => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object') {
                if (typeof item.ingredient === 'string' || typeof item.quantity === 'string') {
                    const left = item.ingredient || '';
                    const right = item.quantity ? ` – ${item.quantity}` : '';
                    return `${left}${right}`.trim();
                }
                const keys = Object.keys(item).filter(k => /^\d+$/.test(k)).sort((a,b)=>Number(a)-Number(b));
                if (keys.length) {
                    return keys.map(k => item[k]).join('');
                }
            }
            return '';
        }).filter(Boolean)
        : String(data.ingredients || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
    const recipe = await Recipe.findByIdAndUpdate(id, { ...data, ingredients }, { new: true });
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