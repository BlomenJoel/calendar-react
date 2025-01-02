"use server"

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../utils/authOptions"
import SegmentedCircle from "../ui/evaluation-tool/circle"
import { db } from "../../../lib/db"
import { evaluations, roleScores } from "../../../lib/schemas"
import { eq, lt } from "drizzle-orm"
import { getDate } from "../utils/dateFormat"

export default async function profile() {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect("/")
    }


    const prevEvals = await db
        .select({
            evaluation: evaluations,
        })
        .from(evaluations)
        .where(lt(evaluations.createdTimestamp, new Date())); // Replace with the desired timestamp

    return (
        <div className="w-2/3 mx-auto">
            <h1>Evaluation</h1>
            <div><h2>Previous evaluations</h2>
                {prevEvals.map((pre, index) =>
                    <div key={index} className="flex flex-row gap-2">
                        {/* {pre.} */}
                        <p>
                            end: {getDate(pre.evaluation.endTimestamp)}
                            <br />
                            start: {getDate(pre.evaluation.startTimestamp)}
                        </p>
                        <a href={`/evaluation/${pre.evaluation.id}`}>
                            Show
                        </a>
                    </div>
                )}
            </div>
            <a href={`/evaluation/new`}>
                Create new
            </a>
        </div>
    )
}
