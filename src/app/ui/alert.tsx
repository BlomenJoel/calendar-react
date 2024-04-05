import { CheckboxInput } from "./checkboxInput"
import { TextInput } from "./textInput"
import { TimeDateInput } from "./timeDateInput"

type Props = {
    startDate: string
    setStartDate: (newDate: string) => void
    endDate: string
    setEndDate: (newDate: string) => void
    handleCreateEvent: (data: any) => void
    title: string
    setTitle: (newTitle: string) => void
    allDayEvent: boolean
    setAllDayEvent: (newVal: boolean) => void
}
export function Alert({
    endDate,
    setEndDate,
    setStartDate,
    startDate,
    handleCreateEvent,
    setTitle,
    title,
    allDayEvent,
    setAllDayEvent }: Props) {
    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50  flex flex-row items-center justify-center">
            <div className="p-24 bg-white">
                <h1 className="text-black">well heloo there!</h1>
                <TextInput label="Title" value={title} setValue={setTitle} />
                <CheckboxInput label="All day event" value={allDayEvent} setValue={setAllDayEvent} />
                <TimeDateInput label="Start" value={startDate} setValue={(event) => setStartDate(event)} />
                <TimeDateInput label="End" value={endDate} setValue={(event) => setEndDate(event)} />
                <button className="text-black" onClick={handleCreateEvent}>Create event</button>
            </div>
        </div>
    )
}
