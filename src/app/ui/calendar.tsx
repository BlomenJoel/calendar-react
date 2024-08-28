'use client'

import { Calendar as ReactBigCalendar, SlotInfo, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { event, goal } from '../../../lib/schemas'
import { useState } from 'react'
import { Alert } from './alert'
import { Goal } from '../utils/types'

const localizer = momentLocalizer(moment)

function GoalDiv({ goal }: { goal: Goal }) {
    return (
        <div className={`relative border-b-4 border-r-4 border-blue-200 rounded-lg w-80 bg-green-400`}>
            <div className={`z-0 absolute -top-7 -right-14`}>
                <div className='rotate-90 origin-left text-xs pb-6 p-1 bg-blue-200 h-14 w-12 rounded-lg'>
                    {goal.title}
                </div>
            </div>
            <div className={`relative bg-green-400 rounded-lg p-1`}>
                <h3 className='h-16'> {goal.description}</h3>
            </div>
        </div>
    )
}
type Props = {
    calendarEvents: typeof event.$inferSelect[],
    createCalendarEvent: (params: typeof event.$inferInsert) => Promise<void>
    goals: typeof goal.$inferSelect[],
}

export function SCalendar({ calendarEvents, createCalendarEvent, goals }: Props) {
    const [showAlert, setShowAlert] = useState(false)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [assosciatedGoal, setAssosciatedGoal] = useState<null | string>(null)
    const [title, setTitle] = useState("")
    const [allDayEvent, setAllDayEvent] = useState(false)

    const getTimeDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`

        return formattedDate
    }
    const createEvent = async (slotInfo: SlotInfo) => {
        setStartDate(getTimeDate(slotInfo.start))
        setEndDate(getTimeDate(slotInfo.end))
        setShowAlert(true)
        setAssosciatedGoal(null)
    }

    const handleCreateEvent = async () => {
        await createCalendarEvent({
            title,
            start: new Date(startDate),
            end: new Date(endDate),
            allDay: allDayEvent,
            goalId: assosciatedGoal
        })
        setShowAlert(false)
    }

    return (
        <div className='w-full pl-4'>
            <div className='flex flex-row justify-between pb-4 h-1/3 gap-12 overflow-clip'>
                <div className='border border-black rounded-lg p-2 flex flex-row gap-4'>
                    <h2 className='font-bold text-sm'>PERSONAL <br /> MISSION <br /> STATEMENT</h2>
                    <p>
                        This is my statement!
                    </p>
                </div>
                <div className='border border-black rounded-lg p-2 flex flex-row gap-4 min-w-96'>
                    <div>
                        <h2 className='font-bold text-sm'>GOALS</h2>
                        <div className='flex flex-col gap-1'>
                            {goals.map((goal, index) =>
                                <GoalDiv key={index} goal={goal} />
                            )}
                        </div>
                    </div>
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
            {showAlert &&
                <Alert
                    handelOutsideClick={() => setShowAlert(false)}
                    title={title}
                    setTitle={setTitle}
                    endDate={endDate}
                    startDate={startDate}
                    setEndDate={setEndDate}
                    setStartDate={setStartDate}
                    setAssociatedGoal={setAssosciatedGoal}
                    handleCreateEvent={handleCreateEvent}
                    allDayEvent={allDayEvent}
                    setAllDayEvent={setAllDayEvent}
                    goals={goals}
                />
            }
        </div>
    )
}