import { formatDate, getTimeDate } from "@/app/utils/dateFormat"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "../input";
import { CalendarEvent } from "@/app/utils/types";

type Props = {
    setIsPopupOpen: (val: undefined | CalendarEvent) => void
    calendarEvent: CalendarEvent
}

export function CalendarShowDialog(props: Props) {
    return (
        <Dialog open={true} onOpenChange={(_open) => props.setIsPopupOpen(undefined)} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{props.calendarEvent.title}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <Input.TimeDate
                        label="Start"
                        value={getTimeDate(props.calendarEvent.start)}
                    />
                    <div>
                        <Input.TimeDate
                            label="End"
                            value={getTimeDate(props.calendarEvent.end)}
                        />
                    </div>
                    <h3>Associated goal: {props.calendarEvent.goalTitle}</h3>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}