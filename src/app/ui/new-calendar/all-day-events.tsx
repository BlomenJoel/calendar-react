import { CalendarEvent } from "@/app/utils/types"
import { TableHead, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Dispatch, SetStateAction } from "react"

type Props = {
    days: string[]
    currentWeekStart: Date
    calendarEvents: CalendarEvent[] | undefined
    setShowCalendarEvent: Dispatch<SetStateAction<undefined | CalendarEvent>>,

}

export const AllDayEvents = ({ days, currentWeekStart, calendarEvents, setShowCalendarEvent }: Props) => {

    const getAllDayEvents = (date: Date) => {
        return calendarEvents?.filter(event =>
            event.allDay &&
            event.start <= date &&
            event.end > date
        )
    }

    return (
        <TableRow>
            <TableHead className="w-20 border-r border-gray-200">All Day</TableHead>
            {days.map((day, index) => {
                const date = new Date(currentWeekStart)
                date.setDate(currentWeekStart.getDate() + index)
                date.setHours(0)
                const allDayEvents = getAllDayEvents(date)
                return (
                    <TableHead
                        key={day}
                        className={cn("p-0 border-r border-gray-200", "h-20 align-top")}
                    >
                        <div className="p-1 h-full overflow-y-auto">
                            {allDayEvents?.map((event) => (
                                <div
                                    onClick={() => { setShowCalendarEvent(event) }}
                                    key={event.id}
                                    className={cn('bg-blue-500 text-white p-1 mb-1 text-xs rounded cursor-pointer', event.completed && 'line-through')}
                                    style={event.color ? { backgroundColor: event.color } : {}}
                                    title={event.title}
                                >
                                    {event.title}
                                </div>
                            ))}
                        </div>
                    </TableHead>
                )
            })}
        </TableRow>
    )
}