'use client'
import { CalendarEvent, Goal, GoalWithColor } from "@/app/utils/types"
import { VisualizeGoal } from "../visualizeGoal"

type Props = {
    goals: GoalWithColor[]
}

export default function TopBar({ goals }: Props) {
    return (
        <div className='flex flex-row justify-between pb-4 min-h-80 gap-12 overflow-clip'>
            <div className='border border-black rounded-lg p-2 flex flex-row gap-4'>
                <h2 className='font-bold text-sm'>PERSONAL <br /> MISSION <br /> STATEMENT</h2>
                <p>
                    This is my statement!
                </p>
            </div>
            <div className='border border-black rounded-lg p-2 flex flex-row gap-4 min-w-96'>
                <div>
                    <h2 className='font-bold text-sm'>GOALS</h2>
                    <div className='flex flex-col gap-1'>
                        {goals.map((goal, index) =>
                            <VisualizeGoal key={index} title={goal.title} description={goal.description} color={goal.color} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}