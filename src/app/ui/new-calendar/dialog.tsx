import { formatDate, getTimeDate } from "@/app/utils/dateFormat"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "../input";
import { Goal } from "@/app/utils/types";
import { useEffect, useState } from "react";
import { event } from "../../../../lib/schemas";

type Slot = { hour: number, date: Date, minute: number }

type Props = {
    isPopupOpen: boolean
    setIsPopupOpen: (val: boolean) => void
    selectedSlots: Slot[]
    goals: Goal[]
    handleCreateEvent: (data: typeof event.$inferInsert) => void;
}


export function CalendarDialog(props: Props) {
    const [startDate, setStartDate] = useState<string>()
    const [endDate, setEndDate] = useState<string>()
    const [title, setTitle] = useState("")
    const [allDayEvent, setAllDayEvent] = useState(false)
    const [associatedGoal, setAssociatedGoal] = useState<string>()

    useEffect(() => {
        const dates = props.selectedSlots.sort((a, b) => a.date.getTime() - b.date.getTime() || a.hour - b.hour || a.minute - b.minute)
        if (dates.length > 0) {
            const start = new Date(dates[0].date)
            start.setHours(dates[0].hour)
            start.setMinutes(dates[0].minute)

            const end = new Date(dates[dates.length - 1].date)
            end.setHours(dates[dates.length - 1].hour)
            end.setMinutes(dates[dates.length - 1].minute);

            // Add 30 minutes
            end.setMinutes(end.getMinutes() + 30);

            setStartDate(getTimeDate(start))
            setEndDate(getTimeDate(end))
        }
    }, [props.selectedSlots])

    return (

        <Dialog open={props.isPopupOpen} onOpenChange={props.setIsPopupOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Selected Time Slots</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    { }
                    <Input.Text label="Title" value={title} setValue={setTitle} />
                    <Input.CheckBox
                        label="All day event"
                        value={allDayEvent}
                        setValue={setAllDayEvent}
                    />
                    {!allDayEvent && (
                        <Input.TimeDate
                            label="Start"
                            value={startDate}
                            setValue={(event) => { setStartDate(event) }}
                        />
                    )}
                    {!allDayEvent && (
                        <Input.TimeDate
                            label={undefined}
                            value={endDate}
                            setValue={(event) => setEndDate(event)} />
                    )}
                    <Input.Select options={props.goals.map(goal => ({ label: goal.title, val: goal.id }))} label="Associated goal" onChange={setAssociatedGoal} />
                    <button className="text-black" onClick={() => {
                        if (endDate && startDate) {
                            props.handleCreateEvent({
                                title,
                                allDay: allDayEvent,
                                end: new Date(endDate),
                                start: new Date(startDate),
                                goalId: associatedGoal

                            })
                        }
                    }}>
                        Create event
                    </button>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}