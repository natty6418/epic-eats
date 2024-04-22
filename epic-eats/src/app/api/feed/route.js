import connectDB from "@/db.mjs";
import { Recipe } from "../../../../Model/Recipe.mjs";
import { User } from "../../../../Model/User.mjs";

export async function GET(request) {
    await connectDB();
    const recipes = await Recipe.find().populate('userId').sort({ createdAt: -1 });
    return new Response(JSON.stringify(recipes), {
        status: 200,
        headers: {
        "Content-Type": "application/json",
        },
    });
    }