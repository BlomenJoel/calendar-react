'use client'

import { Calendar, SlotInfo, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

const localizer = momentLocalizer(moment)

export default function calendar() {
    const myEventsList: {
        title: string,
        start: Date,
        end: Date,
        allDay?: boolean
        resource?: any,
    }[] = [
            { title: "Test", end: new Date(), start: new Date(), allDay: false },
            { title: "Test", end: new Date(), start: new Date(), allDay: true }
        ]

    const createEvent = (slotInfo: SlotInfo) => {
        console.log({ slotInfo })
    }
    return (
        <div>
            <Calendar
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
