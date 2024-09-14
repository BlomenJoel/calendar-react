"use server"

import { eq } from "drizzle-orm"
import { db } from "../../../lib/db"
import { goal, role } from "../../../lib/schemas"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Wrapper } from "../ui/profile"
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
    // ADD ERROR HANDLING
    const handleCreateRole = async (newRole: InsertRole) => {
        "use server";
        try {
            await db.insert(role).values({ ...newRole, userId: session.user.id, id: undefined }).returning({ createdId: role.id })
        } catch (err) {
            console.warn(err)
        }
    }

    // ADD ERROR HANDLING
    const handleCreateGoal = async (newGoal: InsertGoal) => {
        "use server";
        try {
            console.log({ newGoal })
            await db.insert(goal).values({ ...newGoal, userId: session.user.id }).returning({ createdId: goal.id })
        } catch (err) {
            console.warn(err)
        }
    }

    return (
        <div className="w-2/3 mx-auto">
            <h1>Profile</h1>
            <div className="flex flex-col gap-12">
                <div>
                    <h3>Personal mission statement</h3>
                </div>
                <Wrapper handleCreateGoal={handleCreateGoal} handleCreateRole={handleCreateRole} updateGoal={updateGoal} updateRole={updateRole} />
            </div>

        </div>
    )
}
