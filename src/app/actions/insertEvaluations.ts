"use server"
import { getServerSession } from "next-auth";
import { db } from "../../../lib/db";
import { evaluations, role, roleScores } from "../../../lib/schemas";
import { and, avg, between, eq, gte, lte, max, sql } from "drizzle-orm";
import { authOptions } from "../utils/authOptions";
import { RoleWithScores, Score } from "../utils/types";

const insertScore = async (scores: typeof roleScores.$inferInsert[]): Promise<void> => {
    const session = await getServerSession(authOptions)
    if (!session) {
        console.warn("Missing session when getting goals", session)
        throw new Error("Missing session")
    }

    await Promise.all(scores.map(score => {
        return db.insert(roleScores).values(score)
    }))
}

const insertEvaluation = async ({ endTimestamp, startTimestamp }: { endTimestamp: Date, startTimestamp: Date }): Promise<string> => {
    const session = await getServerSession(authOptions)
    if (!session) {
        console.warn("Missing session when getting goals", session)
        throw new Error("Missing session")
    }
    const res = await db.insert(evaluations).values({ endTimestamp, startTimestamp, userId: session.user.id }).returning({ id: evaluations.id })
    return res[0].id
}


const updateEvaluations = async (scores: Score[]) => {
    const session = await getServerSession(authOptions)
    if (!session) {
        console.warn("Missing session when getting goals", session)
        return []
    }

    try {
        await Promise.all(scores.map(updatedScore => {
            return db.update(roleScores).set(updatedScore).where(eq(roleScores.id, updatedScore.id))
        }))
    } catch (er) {
        console.warn("failed updating scores", er)
    }
}

export { insertScore, updateEvaluations, insertEvaluation }