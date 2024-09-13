import { getTimeDate } from "@/app/utils/dateFormat"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "../input";
import { CalendarEvent } from "@/app/utils/types";
import { useState } from "react";

type Props = {
    setIsPopupOpen: (val: undefined | CalendarEvent) => void
    calendarEvent: CalendarEvent
    handleUpdateCalendarEvent: (updatedCalendarEvent: CalendarEvent) => Promise<CalendarEvent>
}

export function CalendarShowDialog(props: Props) {
    const [calendarEvent, setCalendarEvent] = useState(props.calendarEvent)

    const handleSetCompleted = async () => {
        const res = await props.handleUpdateCalendarEvent({ ...calendarEvent, completed: !calendarEvent.completed })
        setCalendarEvent(res)
    }

    return (
        <Dialog open={true} onOpenChange={(_open) => props.setIsPopupOpen(undefined)} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{calendarEvent.title}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <Input.TimeDate
                        label="Start"
                        value={getTimeDate(calendarEvent.start)}
                    />
                    <div>
                        <Input.TimeDate
                            label="End"
                            value={getTimeDate(calendarEvent.end)}
                        />
                    </div>
                    <h3>Associated goal: {calendarEvent.goalTitle}</h3>
                    <Input.CheckBox label="Completed" setValue={handleSetCompleted} value={calendarEvent.completed} />
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}