"use server"

import { getServerSession } from "next-auth"
import { redirect, useRouter } from "next/navigation"
import { authOptions } from "../../utils/authOptions"
import SegmentedCircle from "../../ui/evaluation-tool/circle"
import { Button } from "../../ui/button"

export default async function profile({ params }: { params: { evaluationId: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect("/")
    }
    console.log({ params })
    return (
        <div className="w-3/4 mx-auto">
            <SegmentedCircle evaluationId={params.evaluationId} />
        </div>
    )
}
