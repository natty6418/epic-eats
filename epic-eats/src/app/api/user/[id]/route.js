import connectDB from "@/db.mjs";
import {User} from "../../../../../Model/User.mjs";
import { options } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

export async function GET(request, { params}) {
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
    const { id } = params;
    if (id === 'me') {
        const user = await User.findById(session.user.id)?.select('-password');
        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        return new Response(JSON.stringify(user), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    else{
        const user = await User.findById(id).select('-password').select('-email').select('-savedRecipes');
        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        return new Response(JSON.stringify(user), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }   
}

export async function PUT(request, { params }) {
    await connectDB();
    const { id } = params;
    const user = await User.findById(id);
    if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    const data = await request.json();
    Object.assign(user, data);
    await user.save();
    return new Response(JSON.stringify(user), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}