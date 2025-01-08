"use server"
import { getServerSession } from "next-auth";
import { db } from "../../../lib/db";
import { profiles, role } from "../../../lib/schemas";
import { eq } from "drizzle-orm";
import { authOptions } from "../utils/authOptions";

const getProfile = async () => {
    const session = await getServerSession(authOptions)
    if (!session) {
        console.warn("Missing session when getting profile", session)
        return undefined
    }
    const profile = await db.query.profiles.findFirst(
        {
            where: eq(profiles.userId, session.user.id)
        }
    ) as typeof profiles.$inferSelect | undefined
    return profile
}


export { getProfile }