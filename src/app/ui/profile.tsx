"use client"
import { useState } from "react"
import { Goal } from "../utils/types"
import { Button } from "./button"
import { Input } from "./input"
import { goal } from "../../../lib/schemas"
type GoalEvent = typeof goal.$inferInsert

export const GoalDiv = ({ goal, updateGoal }: { goal: Goal, updateGoal: (updatedGoal: GoalEvent) => Promise<void> }) => {
    const [localGoal, setLocalGoal] = useState(goal)
    const [edit, setEdit] = useState(false)

    const setValue = (newVal: string, key: keyof GoalEvent) => {
        setLocalGoal({ ...localGoal, [key]: newVal })
    }

    const save = () => {
        updateGoal(localGoal)
    }
    return (
        <div>
            <Button.Primary onClick={() => setEdit(true)} title="Edit" />
            <Button.Primary onClick={save} title="Save" />
            {edit ?
                <div className="bg-white flex flex-col gap-2">
                    <Input.Text label="Title" setValue={(newVal) => setValue(newVal, "title")} value={localGoal.title} />
                    <Input.Text label="Description" setValue={(newVal) => setValue(newVal, "description")} value={localGoal.description} />
                </div>
                :
                <div className={`relative border-b-4 border-r-4 border-blue-200 rounded-lg w-80 bg-green-400`}>
                    <div className={`z-0 absolute -top-7 -right-14`}>
                        <div className='rotate-90 origin-left text-xs pb-6 p-1 bg-blue-200 h-14 w-12 rounded-lg'>
                            {localGoal.title}
                        </div>
                    </div>
                    <div className={`relative bg-green-400 rounded-lg p-1`}>
                        <h3 className='h-16'> {localGoal.description}</h3>
                    </div>
                </div>
            }
        </div>
    )
}