import { ProgressValues } from "../utils/types"

type Props = { progress: ProgressValues}

export function ProgressBar({progress}: Props) {

    return (
        <div className="relative w-full">
            <div className={`w-${[progress]} transition-[width] bg-white h-4 absolute left-0 -top-2 rounded-xl border border-black`} />
            <div className="w-full bg-black border border-black" />
        </div>
    )
}
