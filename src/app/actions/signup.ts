"use server";
import { db } from "../../../lib/db";
import { goal, profiles, role } from "../../../lib/schemas";
import { Goal, Role } from "../utils/types";

const createUserProfile = async (data: { roles: Role[], goals: Goal[], user: any, personalMissionStatement?: string }) => {
    "use server";
    await db.transaction(async (tx) => {
        const rolesToInsert: typeof role.$inferInsert[] = data.roles.map(role => ({ title: role.title, userId: data.user.id }))
        await tx.insert(role).values(rolesToInsert)

        const goalsToInsert: Goal[] = data.goals.map(goal => ({ ...goal, userId: data.user.id }))
        await tx.insert(goal).values(goalsToInsert)

        await tx.insert(profiles).values({ userId: data.user.id, personalMissionStatement: data.personalMissionStatement })
    })
}

export { createUserProfile }