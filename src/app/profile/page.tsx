"use server"

import { eq } from "drizzle-orm"
import { db } from "../../../lib/db"
import { goal } from "../../../lib/schemas"
import { Goal } from "../utils/types"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { Button } from "../ui/button"
import { GoalDiv } from "../ui/profile"

type GoalEvent = typeof goal.$inferInsert

export default async function profile() {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect("/")
    }
    // ADD ERROR HANDLING
    const updateGoal = async (updatedGoal: GoalEvent) => {
        "use server";
        try {
            await db.update(goal).set({ ...updatedGoal }).where(eq(goal.id, updatedGoal.id!)).returning({ updatedId: goal.id })
        } catch (err) {
            console.warn(err)
        }
    }
    const goals = await db.select().from(goal).where(eq(goal.userId, session.user.id))

    return (
        <div className="w-1/2 mx-auto">
            <h1>Profile</h1>
            <div className="flex flex-row gap-4">
                <div>

                    <h3>Personal mission statement</h3>
                </div>
                <div>

                    <h3>Goals</h3>
                    <div className="flex flex-col gap-2">
                        {goals.map(goal =>
                            <GoalDiv goal={goal} updateGoal={updateGoal} />
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}
