import connectDB from "@/db.mjs";
import { User } from "../../../../../../Model/User.mjs";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

export const dynamic = 'force-dynamic';
export async function GET(request,{params}){
    const session = await getServerSession(options);
    if (!session) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    await connectDB();
    const {id} = params;
    const user = await User.findById(id).populate('recipes');
    const recipes = user.recipes;
    return new Response(JSON.stringify(recipes), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}