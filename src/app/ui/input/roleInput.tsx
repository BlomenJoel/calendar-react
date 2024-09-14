import { Role } from "@/app/utils/types";
import { Input } from ".";
import ColorPicker from "../colorPicker";

type Props = {
    handleSetRoleValues: (newVal: string, index: number, key: keyof Role) => void;
    index: number;
    role: Role
};

export function RoleInput({ handleSetRoleValues, index, role }: Props) {
    return (
        <div key={index}>
            <Input.Text key={index} label="Title" value={role.title} setValue={(newVal) => handleSetRoleValues(newVal, index, 'title')} />
            <div>
                <Input.Text key={index} label="Description" value={role.description || ""} setValue={(newVal) => handleSetRoleValues(newVal, index, 'description')} />
            </div>
            <ColorPicker color={role.color} setColor={(newVal) => handleSetRoleValues(newVal, index, "color")} />
        </div>

    );
}
