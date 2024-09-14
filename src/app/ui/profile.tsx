"use client"
import { useEffect, useState } from "react"
import { Goal, GoalWithColor, Role } from "../utils/types"
import { Button } from "./button"
import { Input } from "./input"
import { goal, role } from "../../../lib/schemas"
import ColorPicker from "./colorPicker"
import { VisualizeGoal } from "./visualizeGoal"
import { useQuery } from "@tanstack/react-query"
import { getGoals } from "../actions/getGoals"
import { getRoles } from "../actions/getRoles"
import { GoalInput } from "./input/goalInput"

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
    const { data: roles, refetch: refetchRoles } = useQuery({
        queryKey: ['roles'],
        queryFn: () => getRoles()
    })

    const handleUpdateGoal = async (updatedGoal: InsertGoal) => {
        await updateGoal(updatedGoal)
        refetchGoals()
    }

    const handleUpdateRole = async (updatedRole: InsertRole) => {
        await updateRole(updatedRole)
        refetchGoals()
        refetchRoles()
    }
    return (
        <div className="flex justify-between w-full">
            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <h3>Goals</h3>
                    <CreateGoal
                        roles={roles}
                        handleCreateGoal={async (newGoal) => {
                            await handleCreateGoal(newGoal)
                            refetchGoals()
                        }}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    {goals?.map(goal =>
                        <EditGoal
                            goal={goal}
                            roles={roles}
                            updateGoal={handleUpdateGoal}
                            key={goal.id} />
                    )}

                </div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <h3>Roles</h3>
                    <CreateRole handleCreateRole={handleCreateRole} />
                </div>

                <div className="flex flex-col gap-2">
                    {roles?.map(role =>
                        <EditRole role={role} updateRole={handleUpdateRole} key={role.id} />
                    )}
                </div>

            </div>
        </div>
    )
}

export const EditGoal = ({ goal, updateGoal, roles }: { goal: GoalWithColor, roles: Role[] | undefined } & EditGoalProps) => {
    const [localGoal, setLocalGoal] = useState(goal)
    const [edit, setEdit] = useState(false)

    const setValue = (newVal: string, key: keyof InsertGoal) => {
        setLocalGoal({ ...localGoal, [key]: newVal })
    }

    useEffect(() => {
        setLocalGoal(goal)
    }, [goal])

    const save = () => {
        updateGoal(localGoal)
        setEdit(false)
    }
    return (
        <div>
            <Button.Primary onClick={() => setEdit(true)} title="Edit" disabled={edit} />
            <Button.Primary onClick={save} title="Save" disabled={!edit} />
            {edit ?
                <GoalInput goal={localGoal} handleSetGoal={(newVal, index, key) => setValue(newVal, key)} index={1} roles={roles || []} />
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
                    <div>
                        <Input.Text label="Description" setValue={(newVal) => setValue(newVal, "description")} value={localRole.description || ''} />
                    </div>
                    <ColorPicker color={localRole.color} setColor={(newVal) => setValue(newVal, "color")} />
                </div>
                :
                <div className={`relative rounded-lg p-4 text-black`} style={localRole.color ? { backgroundColor: localRole.color } : {}}>
                    <p className="text-black">

                        title: {localRole.title}
                    </p>
                    <p className="text-black">
                        description: {localRole.description}
                    </p>
                </div>
            }
        </div>
    )
}


export const CreateRole = ({ handleCreateRole }: CreateRoleProps) => {
    const [localRole, setLocalRole] = useState<typeof role.$inferInsert>({ description: '', title: '', userId: '', color: "#000000" })
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
                    <ColorPicker setColor={(newVal) => setValue(newVal, "color")} color={localRole.color!} />
                    <Button.Primary onClick={save} title="Save" disabled={!create} />
                </div>
                :
                <Button.Primary onClick={() => setCreate(true)} title="Create role" disabled={create} />
            }
        </div>
    )
}

export const CreateGoal = ({ handleCreateGoal, roles }: { roles: Role[] | undefined } & CreateGoalProps) => {
    const [localGoal, setLocalGoal] = useState<typeof goal.$inferInsert>({ description: '', title: '', roleId: '', userId: '' })
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