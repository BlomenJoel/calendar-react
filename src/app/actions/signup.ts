"use server";
import { db } from "../../../lib/db";
import { goal, role } from "../../../lib/schemas";

const createUserProfile = async (data: { roles: string[], goals: string[] }) => {
    "use server";
    await db.transaction(async (tx) => {
        //TODO: Get referens to user
        const rolesToInsert = data.roles.map(role => ({ title: role, userId: "bbad71c9-2f54-47ec-952f-e15f83626676" }))
        await tx.insert(role).values(rolesToInsert)

        const goalsToInsert = data.goals.map(goal => ({ title: goal, userId: "bbad71c9-2f54-47ec-952f-e15f83626676" }))
        await tx.insert(goal).values(goalsToInsert)
    })
}

export { createUserProfile }