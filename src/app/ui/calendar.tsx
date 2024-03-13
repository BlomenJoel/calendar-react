'use client'

import { Calendar as ReactBigCalendar, SlotInfo, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { event } from '../../../lib/schemas'

const localizer = momentLocalizer(moment)

export function Calendar({ calendarEvents }: { calendarEvents: typeof event.$inferSelect[] }) {
    const myEventsList: {
        title: string,
        start: Date,
        end: Date,
        allDay: boolean
    }[] = calendarEvents

    const createEvent = (slotInfo: SlotInfo) => {
        console.log({ slotInfo })
    }

    return (
        <div>
            <ReactBigCalendar
                localizer={localizer}
                startAccessor="start"
                endAccessor="end"
                defaultView='week'
                events={myEventsList}
                style={{ height: "100vh" }}
                onSelectSlot={createEvent}
                selectable={true}
            />
        </div>
    )
}