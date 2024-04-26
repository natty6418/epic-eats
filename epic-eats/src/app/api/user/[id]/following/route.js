import connectDB from "@/db.mjs";
import { User } from "../../../../../../Model/User.mjs";
import { options } from "../../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

export const dynamic = 'force-dynamic';
export async function GET(request, { params }){
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
    const userId = id==='me' ? session.user.id : id;
    await connectDB();
    const user = await User.findById(userId).populate('following');
    return new Response(JSON.stringify(user.following), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}