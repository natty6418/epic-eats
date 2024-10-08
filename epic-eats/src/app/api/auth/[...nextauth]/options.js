import connectDB from "@/db.mjs";
import {User} from "../../../../../Model/User.mjs";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
export const options = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                await connectDB();
                const { email, password } = credentials;
                const user = await User.findOne({ email });
                if (!user) {
                    return null;
                }
                const validPassword = await bcrypt.compare(password, user.password);
                if (!validPassword) {
                    return null;
                }
                console.log("Logged In.")
                return { email: user.email, username: user.username, id: user._id };
            }
        })
    ],
    pages: {
        signIn: '/login',
  },
    session:{
        strategy: "jwt",
        maxAge: 4*60*60
    },
    callbacks: {
        async jwt({ token, user, account, trigger, session  }) {
            if (user) {
                return {
                  ...token,
                  user: {
                    ...user,
                    account,
                  },
                }
              }
            if (trigger === "update" && session) {
                token = {...token, user : session}
                return token;
              };
            return token;
        },
        async session({session, token}) {
            session.user = token.user
            return session;
        },
    }
}