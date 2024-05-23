'use client'

import { Calendar as ReactBigCalendar, SlotInfo, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { event, goal, role } from '../../../lib/schemas'
import { createCalendarEvent } from '../actions'
import { useFormState } from 'react-dom'
import { useState } from 'react'
import { Alert } from './alert'

const localizer = momentLocalizer(moment)

type Goal = typeof goal.$inferSelect;

function GoalDiv({goal}: {goal: Goal}){
    return (
        // <div className={`relative bg-white border-${goal.roleColor} border-b-2 p-1`}>
        <div className={`relative bg-white border-b-2 p-1`}>
            {/* <div className={`z-0 h-[20px] absolute -right-12 top-8 overflow-hidden text-xs p-1 bg-${goal.roleColor}`}> */}
            <div className={`z-0 h-[20px] absolute -right-12 top-8 overflow-hidden text-xs p-1`}>
                <div className='rotate-90'>
                {/* {goal.roleId} */}
                {goal.id}
                </div>
            </div>
            <div>
                <h3>{goal.title}</h3>
                {/* <p>{goal.description}</p> */}
            </div>
        </div>
    )
}
type Props  = {  
    calendarEvents: typeof event.$inferSelect[], 
    createCalendarEvent: (params: typeof event.$inferInsert) => Promise<void>
    roles: typeof role.$inferSelect[],
    goals: typeof goal.$inferSelect[],
}
export function Calendar({ calendarEvents, createCalendarEvent, roles, goals }: Props) {
    const [showAlert, setShowAlert] = useState(false)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [title, setTitle] = useState("")
    const [allDayEvent, setAllDayEvent] = useState(false)

    //TODO: Replave with real data.
    const getTimeDate = (date: Date) => {
        const split = date.toISOString().split(":")
        return `${split[0]}:${split[1]}`
    }
    const createEvent = async (slotInfo: SlotInfo) => {
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
        <div className='w-full pl-4'>
            <div className='flex flex-row justify-between pb-4'>
                <div className='border border-black rounded-lg p-2 flex flex-row gap-4'>
                    <h2 className='font-bold text-sm'>PERSONAL <br/> MISSION <br /> STATEMENT</h2>
                    <p>
                        This is my statement!
                    </p>
                </div>
                <div className='border border-black rounded-lg p-2 flex flex-row gap-4'>
                    <h2 className='font-bold text-sm'>GOALS</h2>
                    {goals.map((goal, index) => <GoalDiv key={index}  goal={goal}/>)}
                </div>
            </div>
            <ReactBigCalendar
                localizer={localizer}
                startAccessor="start"
                endAccessor="end"
                defaultView='week'
                events={calendarEvents}
                style={{ height: "100vh" }}
                onSelectSlot={createEvent}
                selectable={true}
            />
            {showAlert && <Alert title={title} setTitle={setTitle} endDate={endDate} startDate={startDate} setEndDate={setEndDate} setStartDate={setStartDate} handleCreateEvent={handleCreateEvent} allDayEvent={allDayEvent} setAllDayEvent={setAllDayEvent} />}
        </div>
    )
}