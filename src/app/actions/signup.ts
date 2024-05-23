"use server";
import { db } from "../../../lib/db";
import { goal, role } from "../../../lib/schemas";

const createUserProfile = async (data: { roles: string[], goals: string[], user: any }) => {
    "use server";
    await db.transaction(async (tx) => {
        const rolesToInsert = data.roles.map(role => ({ title: role, userId: data.user.id }))
        await tx.insert(role).values(rolesToInsert)

        const goalsToInsert = data.goals.map(goal => ({ title: goal, userId: data.user.id }))
        await tx.insert(goal).values(goalsToInsert)
    })
}

export { createUserProfile }