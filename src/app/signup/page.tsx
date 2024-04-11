"use client"

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createUserProfile } from "../actions/signup";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const [goals, setGoals] = useState([""])
    const [roles, setRoles] = useState([""])
    const [step, setStep] = useState(0)

    const router = useRouter()

    const handleSetGoalValues = (newVal: string, index: number) => {
        goals[index] = newVal
        setGoals(goals)
    }
    const handleSetRoleValues = (newVal: string, index: number) => {
        roles[index] = newVal
        setRoles(roles)
    }

    const handleContinue = async () => {
        if (step === 1) {
            await createUserProfile({ goals, roles })
            router.push("/calendar")
        } else {
            setStep(step + 1)
        }
    }

    return (
        <div>
            {step === 0 &&
                <div className="w-44">
                    <Button.Primary onClick={() => setGoals([...goals, ""])} title="Add goal" />
                    <div className="flex flex-col">
                        {goals.map((g, index) => <Input.Text key={index} label="Goals" value={g} setValue={(newVal) => handleSetGoalValues(newVal, index)} />)}
                    </div>
                    <Button.Primary onClick={handleContinue} title="Continue" />
                </div>
            }
            {step === 1 && (
                <div className="w-44">
                    <Button.Primary onClick={() => setRoles([...roles, ""])} title="Add role" />
                    <div className="flex flex-col">
                        {roles.map((g, index) => <Input.Text key={index} label="Roles" value={g} setValue={(newVal) => handleSetRoleValues(newVal, index)} />)}
                    </div>
                    <Button.Primary onClick={handleContinue} title="Continue" />
                </div>
            )}
        </div>
    )

}