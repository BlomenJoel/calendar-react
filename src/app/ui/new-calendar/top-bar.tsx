'use client'
import { Goal } from "@/app/utils/types"

type Props = {
    goals: Goal[]
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
                            <GoalDiv key={index} goal={goal} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}


function GoalDiv({ goal }: { goal: Goal }) {
    return (
        <div className={`relative border-b-4 border-r-4 border-blue-200 rounded-lg w-80 bg-green-400`}>
            <div className={`z-0 absolute -top-7 -right-14`}>
                <div className='rotate-90 origin-left text-xs pb-6 p-1 bg-blue-200 h-14 w-12 rounded-lg'>
                    {goal.title}
                </div>
            </div>
            <div className={`relative bg-green-400 rounded-lg p-1`}>
                <h3 className='h-16'> {goal.description}</h3>
            </div>
        </div>
    )
}