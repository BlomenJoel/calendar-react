import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "../../../../../lib/db";
import "../../../../../lib/envConfig";

if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("Missing env GOOGLE_CLIENT_ID")
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Missing env GOOGLE_CLIENT_SECRET")
}

const authOptions = {
    adapter: DrizzleAdapter(db) as any,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    session: {
        strategy: "database"
    },
    callbacks: {
        session: async ({ session, user }) => {
            if (session?.user && user.id) {
                session.user.id = user.id;
            }
            return session;
        },
        async redirect({ baseUrl }) {
            return baseUrl + '/calendar'
        },
    },
} satisfies NextAuthOptions

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST, authOptions }