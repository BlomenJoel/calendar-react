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
        // callbacks: {
    // jwt({ token, account, user,  }) {
    //     if (account) {
    //         token.accessToken = account.access_token
    //         token.id = user?.id
    //     }
    //     return token
    // },
    // session({ session, token }) {
    //     // I skipped the line below coz it gave me a TypeError
    //     // session.accessToken = token.accessToken;
    //     session.user.id = token.id as string;

    //     return session;
    // },
    // }
} satisfies NextAuthOptions


// export const { handlers, auth, signIn, signOut } = NextAuth({
//     adapter: DrizzleAdapter(db),
//     providers: [],
//   })
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }