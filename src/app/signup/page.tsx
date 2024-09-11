"use client"

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ProgressBar } from "../ui/progress-bar";
import { createUserProfile } from "../actions/signup";
import { useRouter } from "next/navigation";
import { Goal, ProgressValues } from "../utils/types";
import { useSession } from "next-auth/react"
import ColorPicker from "../ui/colorPicker";

const LAST_STEP = 3

export default function SignUp() {
    const { data: session } = useSession()
    const [goals, setGoals] = useState<Goal[]>([])
    const [roles, setRoles] = useState([""])
    const [pms, setPMS] = useState("")
    const [progress, setProgress] = useState<ProgressValues>("1/4")
    const [step, setStep] = useState(0)

    const router = useRouter()

    const handleSetGoal = (newVal: string, index: number, key: keyof Goal) => {
        goals[index][key] = newVal
        setGoals(goals)
    }
    const handleSetRoleValues = (newVal: string, index: number) => {
        roles[index] = newVal
        setRoles(roles)
    }

    const handleContinue = async () => {
        if (step === LAST_STEP && session?.user) {
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
                    <div className="w-full">                 <div className="flex flex-col gap-4 text-center">
                        ¨                   <h1>Personal mission statement</h1>
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
                            ¨                   <h1>Roller</h1>
                            <p>Vad är dina övergripliga roller?</p>
                        </div>
                        <div className="flex flex-col p-8 my-4 pb-4 border border-black rounded-xl gap-2 w-full">
                            {/* TODO: Add description! */}
                            {roles.map((role, index) => <Input.Text key={index} label="" value={role} setValue={(newVal) => handleSetRoleValues(newVal, index)} />)}
                            <div className="w-12 mt-4 flex flex-col justify-center mx-auto">
                                <Button.Primary onClick={() => setRoles([...roles, ""])} title="+" />
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
                                <div key={index}>
                                    <Input.Text label="" value={g.title} setValue={(newVal) => handleSetGoal(newVal, index, "title")} />
                                    <Input.Text label="" value={g.description} setValue={(newVal) => handleSetGoal(newVal, index, "description")} />
                                    <ColorPicker color={g.color} setColor={(newVal) => handleSetGoal(newVal, index, "color")} />
                                </div>
                            )}
                            <div className="w-12 mt-4 flex flex-col justify-center mx-auto">
                                <Button.Primary onClick={() => setGoals([...goals, { color: "", description: "", id: "", title: "", userId: "" }])} title="+" />
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