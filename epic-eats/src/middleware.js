import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
// import { options } from "./app/api/auth/[...nextauth]/options";
// import { getServerSession } from "next-auth";
export async function middleware(req) {
    // const session = await getServerSession(options, req);
    // if (!session) {
    //     return NextResponse.redirect(new URL('/login', req.url));
    // }
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
}


export const config = {
    matcher: ['/feed', '/profile/:path', '/recipe', '/create']
};