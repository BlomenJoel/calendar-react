"use server"
import { getServerSession } from "next-auth";
import { db } from "../../../lib/db";
import { goal, role } from "../../../lib/schemas";
import { eq } from "drizzle-orm";
import { authOptions } from "../utils/authOptions";
import { GoalWithColor } from "../utils/types";

const getGoals = async (): Promise<GoalWithColor[]> => {
    const session = await getServerSession(authOptions)
    if (!session) {
        console.warn("Missing session when getting goals", session)
        return []
    }
    return await db
        .select({
            id: goal.id,
            userId: goal.userId,
            roleId: goal.roleId,
            title: goal.title,
            description: goal.description,
            color: role.color
        })
        .from(goal)
        .leftJoin(role, eq(role.id, goal.roleId))
        .where(eq(goal.userId, session.user.id))
}


export { getGoals }