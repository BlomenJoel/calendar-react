"use server"

import { eq } from "drizzle-orm"
import { db } from "../../../lib/db"
import { goal, role } from "../../../lib/schemas"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { GoalDiv, RoleDiv } from "../ui/profile"
import { authOptions } from "../utils/authOptions"

type InsertGoal = typeof goal.$inferInsert
type InsertRole = typeof role.$inferInsert

export default async function profile() {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect("/")
    }
    // ADD ERROR HANDLING
    const updateGoal = async (updatedGoal: InsertGoal) => {
        "use server";
        try {
            await db.update(goal).set({ ...updatedGoal }).where(eq(goal.id, updatedGoal.id!)).returning({ updatedId: goal.id })
        } catch (err) {
            console.warn(err)
        }
    }
    // ADD ERROR HANDLING
    const updateRole = async (updatedRole: InsertRole) => {
        "use server";
        try {
            await db.update(role).set({ ...updatedRole }).where(eq(role.id, updatedRole.id!)).returning({ updatedId: role.id })
        } catch (err) {
            console.warn(err)
        }
    }
    const goals = await db.select().from(goal).where(eq(goal.userId, session.user.id))
    const roles = await db.select().from(role).where(eq(role.userId, session.user.id))

    return (
        <div className="w-1/2 mx-auto">
            <h1>Profile</h1>
            <div className="flex flex-row gap-12">
                <div>
                    <h3>Personal mission statement</h3>
                </div>
                <div>
                    <h3>Goals</h3>
                    <div className="flex flex-col gap-2">
                        {goals.map(goal =>
                            <GoalDiv goal={goal} updateGoal={updateGoal} key={goal.id} />
                        )}
                    </div>
                </div>
                <div>
                    <h3>Roles</h3>
                    <div className="flex flex-col gap-2">
                        {roles.map(role =>
                            <RoleDiv role={role} updateRole={updateRole} key={role.id} />
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}
