"use client"

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ProgressBar } from "../ui/progress-bar";
import { createUserProfile } from "../actions/signup";
import { useRouter } from "next/navigation";
import { Goal, ProgressValues, Role } from "../utils/types";
import { signIn, useSession } from "next-auth/react"

const LAST_STEP = 4

export default function SignUp() {
    const { data: session } = useSession()
    if (!session) {
        signIn()
    }
    const [goals, setGoals] = useState<Goal[]>([])
    const [roles, setRoles] = useState<Role[]>([])
    const [pms, setPMS] = useState("")
    const [progress, setProgress] = useState<ProgressValues>("1/4")
    const [step, setStep] = useState(0)

    const router = useRouter()

    const handleSetGoal = (newVal: string, index: number, key: keyof Goal) => {
        const updatedGoals = [...goals];
        const updatedGoal = { ...updatedGoals[index] };
        updatedGoal[key] = newVal;
        updatedGoals[index] = updatedGoal;
        setGoals(updatedGoals);
    }

    const handleSetRoleValues = (newVal: string, index: number, key: keyof Role) => {
        const updatedRoles = [...roles];
        const updatedRole = { ...updatedRoles[index] };
        updatedRole[key] = newVal;
        updatedRoles[index] = updatedRole;
        setRoles(updatedRoles);
    }

    const handleContinue = async () => {
        console.log('handel contunie', { session }, { step })
        if (step >= LAST_STEP && session?.user) {
            await createUserProfile({ goals, roles, user: session.user })
            router.push("/calendar")
        } else {
            setStep(step + 1)
            switch (step) {
                case 0:
                    setProgress("2/4");
                    return;
                case 1:
                    setProgress("3/4");
                    return;
                case 2:
                case 3:
                default:
                    setProgress("full");
                    return;
            }
        }
    }

    return (
        <div className="w-1/2 mx-auto">
            <div className="min-h-screen flex flex-col items-center justify-center gap-12">
                {step === 0 &&
                    <div className="flex flex-col gap-4 text-center">
                        <h1>Varför finns den här kalendern?</h1>
                        <p><i>&qout Genom att förlänga tiden mellan stimuli och respons får vi frihet &qout </i></p>
                    </div>
                }
                {step === 1 &&
                    <div className="w-full">
                        <div className="flex flex-col gap-4 text-center">
                            <h1>Personal mission statement</h1>
                            <p>Fyll i ditt PMS om du har ett! Annars går det bra att göra det senare.</p>
                        </div>
                        <div className="flex flex-col p-8 my-4 pb-4 border border-black rounded-xl gap-2">
                            <Input.Text label="" value={pms} setValue={(newVal) => setPMS(newVal)} />
                        </div>
                    </div>
                }
                {step === 2 &&
                    <div className="w-full">
                        <div className="flex flex-col gap-4 text-center">
                            <h1>Roller</h1>
                            <p>Vad är dina övergripliga roller?</p>
                        </div>
                        <div className="flex flex-col p-8 my-4 pb-4 border border-black rounded-xl gap-2 w-full">
                            {roles.map((role, index) =>
                                <Input.Role key={index} handleSetRoleValues={handleSetRoleValues} index={index} role={role} />
                            )}
                            <div className="w-12 mt-4 flex flex-col justify-center mx-auto">
                                <Button.Primary onClick={() => setRoles([...roles, { description: '', id: '', title: '', userId: '', color: '' }])} title="+" />
                            </div>
                        </div>
                    </div>
                }
                {step === 3 && (
                    <div className="w-full">
                        <div className="flex flex-col gap-4 text-center">
                            <h1>Visioner och drömmer</h1>
                            <p>Vad är dina övergripliga mål och vad strävar du efter?</p>
                        </div>
                        <div className="flex flex-col p-8 my-4 pb-4 border border-black rounded-xl gap-2 w-full">
                            {goals.map((g, index) =>
                                <Input.Goal roles={roles} key={index} goal={g} handleSetGoal={handleSetGoal} index={index} />
                            )}
                            <div className="w-12 mt-4 flex flex-col justify-center mx-auto">
                                <Button.Primary onClick={() => setGoals([...goals, { description: "", id: "", title: "", userId: "", roleId: '' }])} title="+" />
                            </div>
                        </div>
                    </div>
                )}
                <div className="ml-auto">

                    <Button.Primary onClick={handleContinue} title={LAST_STEP === step ? "Skapa profil" : "Nästa"} />
                </div>
                <ProgressBar progress={progress} />
            </div>
        </div>
    )

}