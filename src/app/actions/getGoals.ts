"use server"
import { getServerSession } from "next-auth";
import { db } from "../../../lib/db";
import { goal } from "../../../lib/schemas";
import { eq } from "drizzle-orm";
import { authOptions } from "../utils/authOptions";

const getGoals = async () => {
    const session = await getServerSession(authOptions)
    if (!session) {
        console.warn("Missing session when getting goals", session)
        return []
    }
    return await db.select().from(goal).where(eq(goal.userId, session.user.id))
}


export { getGoals }