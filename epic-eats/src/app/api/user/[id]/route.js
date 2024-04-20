import connectDB from "@/db.mjs";
import {User} from "../../../../../Model/User.mjs";

export async function GET(request, { params}) {

    await connectDB();
    const { id } = params;
    const user = await User.findById(id)?.select('-password');
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