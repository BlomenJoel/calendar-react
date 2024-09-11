'use client'
import { useState, useRef } from "react"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatDate } from "@/app/utils/dateFormat"
import { CalendarDialog } from "./dialog"
import { Navigation } from "./navigation"
import { TableHour } from "./tableHour"
import { Goal } from "@/app/utils/types"
import { event } from "../../../../lib/schemas"
import { useQuery } from "@tanstack/react-query"
import { getCalendarEvents } from "@/app/actions/getCalendarEvents"

export type SelectedSlot = {
  date: Date
  hour: number
  minute: number
}

type Props = {
  goals: Goal[],
  createCalendarEvent: (params: typeof event.$inferInsert) => Promise<void>
}

const getWeek = (weekStart: Date) => {
  // Calculate the start of the week (Monday)
  const dayOfWeek = weekStart.getDay(); // 0 is Sunday, 1 is Monday, etc.
  const startOfWeek = new Date(weekStart);
  startOfWeek.setDate(weekStart.getDate() - ((dayOfWeek + 6) % 7)); // Adjust to Monday
  startOfWeek.setHours(0, 0, 0, 0); // Set to start of day
  // Calculate the end of the week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999); // Set to end of day
  return { endOfWeek, startOfWeek }
}



export default function NewCalendarTable({ goals, createCalendarEvent }: Props) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date()
    const day = today.getDay()
    return new Date(today.setDate(today.getDate() - day + (day === 0 ? -6 : 1)))
  })
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const startSlotRef = useRef<SelectedSlot | null>(null)

  const { data: calendarEvents } = useQuery({
    queryKey: [currentWeekStart],
    queryFn: () => getCalendarEvents(getWeek(currentWeekStart))
  })

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const handleMouseUp = () => {
    setIsDragging(false)
    startSlotRef.current = null
    if (selectedSlots.length > 0) {
      setIsPopupOpen(true)
    }
  }

  const handleShowPopup = () => {
    if (selectedSlots.length > 0) {
      setIsPopupOpen(true)
    }
  }


  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeekStart(prev => {
      const newDate = new Date(prev)
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
      return newDate
    })
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false)
    setSelectedSlots([])
  }

  const handleCreateEvent = async ({ ...data }: typeof event.$inferInsert) => {
    await createCalendarEvent({
      title: data.title,
      start: new Date(data.start),
      end: new Date(data.end),
      allDay: data.allDay,
      goalId: data.goalId
    })
    handleClosePopup()
  }
  const getAllDayEvents = (date: Date) => {
    return calendarEvents?.filter(event =>
      event.allDay &&
      event.start <= date &&
      event.end > date
    )
  }
  const filterCalendarEvents = () => calendarEvents?.filter(event => event.allDay === false)

  return (
    <div className="container mx-auto py-10" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <Navigation currentWeekStart={currentWeekStart} navigateWeek={navigateWeek} />
      <Table className="border-collapse w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-20 border-r border-gray-200">All Day</TableHead>
            {days.map((day, index) => {
              const date = new Date(currentWeekStart)
              date.setDate(currentWeekStart.getDate() + index)
              const allDayEvents = getAllDayEvents(date)
              return (
                <TableHead
                  key={day}
                  className={cn("p-0 border-r border-gray-200", "h-20 align-top")}
                >
                  <div className="p-1 h-full overflow-y-auto">
                    {allDayEvents?.map((event, eventIndex) => (
                      <div
                        key={event.id}
                        className="bg-blue-500 text-white p-1 mb-1 text-xs rounded"
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
          <TableRow>
            <TableHead className="w-20">Time</TableHead>
            {days.map((day, index) => {
              const date = new Date(currentWeekStart)
              date.setDate(currentWeekStart.getDate() + index)
              return (
                <TableHead
                  key={day}
                  className={cn("text-center", index < days.length - 1 && "border-r border-gray-200")}
                >
                  <div>{day}</div>
                  <div className="text-sm font-normal">{formatDate(date)}</div>
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>

        <TableBody>
          {hours.map((hour) => (
            <TableHour
              key={hour}
              currentWeekStart={currentWeekStart}
              days={days}
              events={filterCalendarEvents()}
              hour={hour}
              isDragging={isDragging}
              selectedSlots={selectedSlots}
              setIsDragging={setIsDragging}
              setSelectedSlots={setSelectedSlots}
              startSlotRef={startSlotRef}
            />
          ))}
        </TableBody>
      </Table>

      <div className="mt-4">
        <Button onClick={handleShowPopup} disabled={selectedSlots.length === 0}>
          Show Selected Slots
        </Button>
      </div>
      <CalendarDialog
        goals={goals}
        handleCreateEvent={handleCreateEvent}
        isPopupOpen={isPopupOpen}
        selectedSlots={selectedSlots}
        setIsPopupOpen={handleClosePopup}

      />
    </div>
  )
}