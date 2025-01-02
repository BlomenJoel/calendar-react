import { Goal, Role } from "@/app/utils/types";
import { Input } from ".";
import { goal } from "../../../../lib/schemas";

type Props = {
    handleSetGoal: (newVal: string, index: number, key: keyof Goal) => void;
    index: number;
    goal: typeof goal.$inferInsert
    roles: Role[]
};

export function GoalInput({ handleSetGoal, index, goal, roles }: Props) { // TODO: Make some field required
    return (
        <div key={index}>
            <Input.Text label="Title" value={goal.title} setValue={(newVal) => handleSetGoal(newVal, index, "title")} />
            <div>
                <Input.Text label="Description" value={goal.description} setValue={(newVal) => handleSetGoal(newVal, index, "description")} />
            </div>
            <Input.Select label="Related roles" onChange={(newVal) => handleSetGoal(newVal, index, 'roleId')} required options={roles.map(role => ({ label: role.title, val: role.id }))} />
        </div>
    );
}
