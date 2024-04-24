import connectDB from "@/db.mjs";
import { Recipe, validateRecipe } from "../../../../Model/Recipe.mjs";
import { User } from "../../../../Model/User.mjs";
import { options } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";


export async function POST(request){
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
    const userId = session.user.id;
    const data = await request.json();
    const { error } = validateRecipe({ ...data });
    if (error) {
        return new Response(JSON.stringify({ error: error.details[0].message }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    console.log(data);
    const recipe = new Recipe({ ...data, userId: userId, createdAt: new Date() });

    await recipe.save();
    const user = await User.findById(userId);
    user.recipes.push(recipe);
    await user.save();
    return new Response(JSON.stringify(recipe), {
        status: 201,
        headers: {
            'Content-Type': 'application/json'
        }
    });

}
