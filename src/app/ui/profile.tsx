"use client"
import { useState } from "react"
import { Goal, Role } from "../utils/types"
import { Button } from "./button"
import { Input } from "./input"
import { goal, role } from "../../../lib/schemas"
import ColorPicker from "./colorPicker"
import { VisualizeGoal } from "./visualizeGoal"

type InsertGoal = typeof goal.$inferInsert

export const GoalDiv = ({ goal, updateGoal }: { goal: Goal, updateGoal: (updatedGoal: InsertGoal) => Promise<void> }) => {
    const [localGoal, setLocalGoal] = useState(goal)
    const [color, setColor] = useState("#000000")
    const [edit, setEdit] = useState(false)

    const setValue = (newVal: string, key: keyof InsertGoal) => {
        setLocalGoal({ ...localGoal, [key]: newVal })
    }

    const save = () => {
        updateGoal(localGoal)
    }
    return (
        <div>
            <Button.Primary onClick={() => setEdit(true)} title="Edit" disabled={edit} />
            <Button.Primary onClick={save} title="Save" disabled={!edit} />
            {edit ?
                <div className="bg-white flex flex-col gap-2">
                    <Input.Text label="Title" setValue={(newVal) => setValue(newVal, "title")} value={localGoal.title} />
                    <Input.Text label="Description" setValue={(newVal) => setValue(newVal, "description")} value={localGoal.description} />
                    <ColorPicker setColor={setColor} color={color} />
                </div>
                :
                <VisualizeGoal description={localGoal.description} title={localGoal.title} color={localGoal.color} />
            }
        </div>
    )
}

type RoleInsert = typeof role.$inferInsert

export const RoleDiv = ({ role, updateRole }: { role: Role, updateRole: (updatedGoal: RoleInsert) => Promise<void> }) => {
    const [localRole, setLocalRole] = useState(role)
    const [edit, setEdit] = useState(false)

    const setValue = (newVal: string, key: keyof RoleInsert) => {
        setLocalRole({ ...localRole, [key]: newVal })
    }

    const save = () => {
        updateRole(localRole)
        setEdit(false)
    }
    return (
        <div>
            <Button.Primary onClick={() => setEdit(true)} title="Edit" disabled={edit} />
            <Button.Primary onClick={save} title="Save" disabled={!edit} />
            {edit ?
                <div className="bg-white flex flex-col gap-2">
                    <Input.Text label="Title" setValue={(newVal) => setValue(newVal, "title")} value={localRole.title} />
                </div>
                :
                <div className={`relative rounded-lg w-80 bg-green-400`}>
                    {localRole.title}
                </div>
            }
        </div>
    )
}