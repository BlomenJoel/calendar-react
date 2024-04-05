'use client'

import { Calendar as ReactBigCalendar, SlotInfo, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { event } from '../../../lib/schemas'
import { createCalendarEvent } from '../actions'
import { useFormState } from 'react-dom'
import { useState } from 'react'
import { Alert } from './alert'
const localizer = momentLocalizer(moment)

const initialState = {
    title: "",
    start: new Date(),
    end: new Date(),
    allDay: false
}

export function Calendar({ calendarEvents, createCalendarEvent }: { calendarEvents: typeof event.$inferSelect[], createCalendarEvent: (params: typeof event.$inferInsert) => Promise<void> }) {
    const [showAlert, setShowAlert] = useState(false)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [title, setTitle] = useState("")
    const [allDayEvent, setAllDayEvent] = useState(false)

    const myEventsList: {
        title: string,
        start: Date,
        end: Date,
        allDay: boolean
    }[] = calendarEvents
    const getTimeDate = (date: Date) => {
        const split = date.toISOString().split(":")
        return `${split[0]}:${split[1]}`
    }
    const createEvent = async (slotInfo: SlotInfo) => {
        console.log({ slotInfo })
        setStartDate(getTimeDate(slotInfo.start))
        setEndDate(getTimeDate(slotInfo.end))
        setShowAlert(true)
    }

    const handleCreateEvent = async () => {
        await createCalendarEvent({
            title, start: new Date(startDate), end: new Date(endDate), allDay: allDayEvent
        })
        setShowAlert(false)
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
            {showAlert && <Alert title={title} setTitle={setTitle} endDate={endDate} startDate={startDate} setEndDate={setEndDate} setStartDate={setStartDate} handleCreateEvent={handleCreateEvent} allDayEvent={allDayEvent} setAllDayEvent={setAllDayEvent} />}
        </div>
    )
}