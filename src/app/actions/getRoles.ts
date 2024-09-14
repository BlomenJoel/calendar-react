"use server"
import { getServerSession } from "next-auth";
import { db } from "../../../lib/db";
import { role } from "../../../lib/schemas";
import { eq } from "drizzle-orm";
import { authOptions } from "../utils/authOptions";

const getRoles = async () => {
    const session = await getServerSession(authOptions)
    if (!session) {
        console.warn("Missing session when getting goals", session)
        return []
    }
    return await db.select().from(role).where(eq(role.userId, session.user.id))
}


export { getRoles }