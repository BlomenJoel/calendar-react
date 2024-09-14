"use client"
import { useState } from "react"
import { Goal, Role } from "../utils/types"
import { Button } from "./button"
import { Input } from "./input"
import { goal, role } from "../../../lib/schemas"
import ColorPicker from "./colorPicker"
import { VisualizeGoal } from "./visualizeGoal"
import { useQuery } from "@tanstack/react-query"
import { getGoals } from "../actions/getGoals"
import { getRoles } from "../actions/getRoles"

type InsertGoal = typeof goal.$inferInsert
type InsertRole = typeof role.$inferInsert

type EditRoleProps = { updateRole: (updatedGoal: InsertRole) => Promise<void> }
type CreateGoalProps = {
    handleCreateGoal: (newGoal: typeof goal.$inferInsert) => Promise<void>
}
type CreateRoleProps = {
    handleCreateRole: (newRole: typeof role.$inferInsert) => void
}
type EditGoalProps = { updateGoal: (updatedGoal: InsertGoal) => Promise<void> }

type Props = EditGoalProps & EditRoleProps & CreateGoalProps & CreateRoleProps

export const Wrapper = ({ handleCreateGoal, updateGoal, handleCreateRole, updateRole }: Props) => {
    const { data: goals, refetch: refetchGoals } = useQuery({
        queryKey: ['goals'],
        queryFn: () => getGoals()
    })
    const { data: roles } = useQuery({
        queryKey: ['roles'],
        queryFn: () => getRoles()
    })



    const handleUpdateGoal = async (updatedGoal: InsertGoal) => {
        await updateGoal(updatedGoal)
        refetchGoals()
    }
    return (
        <div>

            <div>
                <h3>Goals</h3>
                <div className="flex flex-col gap-2">
                    {goals?.map(goal =>
                        <EditGoal goal={goal}
                            updateGoal={handleUpdateGoal}
                            key={goal.id} />
                    )}
                    <CreateGoal
                        roles={roles}
                        handleCreateGoal={async (newGoal) => {
                            console.log({ newGoal })
                            await handleCreateGoal(newGoal)
                            refetchGoals()
                        }} />
                </div>
            </div>
            <div>
                <h3>Roles</h3>
                <div className="flex flex-col gap-2">
                    {roles?.map(role =>
                        <EditRole role={role} updateRole={updateRole} key={role.id} />
                    )}
                    <CreateRole handleCreateRole={handleCreateRole} />
                </div>

            </div>
        </div>
    )
}

export const EditGoal = ({ goal, updateGoal }: { goal: Goal } & EditGoalProps) => {
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

export const EditRole = ({ role, updateRole }: { role: Role } & EditRoleProps) => {
    const [localRole, setLocalRole] = useState(role)
    const [edit, setEdit] = useState(false)

    const setValue = (newVal: string, key: keyof InsertRole) => {
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


export const CreateRole = ({ handleCreateRole }: CreateRoleProps) => {
    const [localRole, setLocalRole] = useState<typeof role.$inferInsert>({ description: '', title: '', userId: '' })
    const [create, setCreate] = useState(false)

    const setValue = (newVal: string, key: keyof InsertRole) => {
        setLocalRole({ ...localRole, [key]: newVal })
    }

    const save = () => {
        handleCreateRole(localRole)
        setCreate(false)
    }
    return (
        <div>
            {create ?
                <div className="bg-white flex flex-col gap-2">
                    <Input.Text label="Title" setValue={(newVal) => setValue(newVal, "title")} value={localRole.title} />
                    <div>
                        <Input.Text label="Description" setValue={(newVal) => setValue(newVal, "description")} value={localRole.description || ""} />
                    </div>
                    <Button.Primary onClick={save} title="Save" disabled={!create} />
                </div>
                :
                <Button.Primary onClick={() => setCreate(true)} title="Create role" disabled={create} />
            }
        </div>
    )
}

export const CreateGoal = ({ handleCreateGoal, roles }: { roles: Role[] | undefined } & CreateGoalProps) => {
    const [localGoal, setLocalGoal] = useState<typeof goal.$inferInsert>({ description: '', title: '', color: '', roleId: '', userId: '' })
    const [create, setCreate] = useState(false)

    const setValue = (newVal: string, index: number, key: keyof Goal) => {
        setLocalGoal({ ...localGoal, [key]: newVal })
    }

    const save = () => {
        handleCreateGoal(localGoal)
        setCreate(false)
    }
    return (
        <div>
            {create ?
                <div className="bg-white flex flex-col gap-2">
                    <Input.Goal goal={localGoal} handleSetGoal={setValue} index={0} roles={roles || []} />
                    <Button.Primary onClick={save} title="Save" disabled={!create} />
                </div>
                :
                <Button.Primary onClick={() => setCreate(true)} title="Create goal" disabled={create} />
            }
        </div>
    )
}