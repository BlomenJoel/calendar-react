'use client'
import { useState, useRef, useEffect } from "react"
import { Table, TableBody, TableHeader } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CalendarDialog } from "./dialog"
import { Navigation } from "./navigation"
import { TableHour } from "./tableHour"
import { CalendarEvent, Goal } from "@/app/utils/types"
import { event } from "../../../../lib/schemas"
import { useQuery } from "@tanstack/react-query"
import { getCalendarEvents } from "@/app/actions/getCalendarEvents"
import { CalendarShowDialog } from "./show-dialog"
import { AllDayEvents } from "./all-day-events"
import { DisplayDates } from "./display-dates"
import { updateCalendarEvents } from "@/app/actions/updateCalendarEvents"

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
  const [showCalendarEvent, setShowCalendarEvent] = useState<undefined | CalendarEvent>(undefined)
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const startSlotRef = useRef<SelectedSlot | null>(null)

  const { data: calendarEvents, refetch: refetchCalendarEvents } = useQuery({
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

  const handleUpdateCalendarEvent = async (updatedCalendarEvent: CalendarEvent) => {
    const res = await updateCalendarEvents(updatedCalendarEvent)
    refetchCalendarEvents()
    return res
  }

  const handleCreateEvent = async ({ ...data }: typeof event.$inferInsert) => {
    await createCalendarEvent({
      title: data.title,
      start: new Date(data.start),
      end: new Date(data.end),
      allDay: data.allDay,
      goalId: data.goalId
    })
    refetchCalendarEvents()
    handleClosePopup()
  }
  const filterCalendarEvents = () => calendarEvents?.filter(event => event.allDay === false)

  return (
    <div className="container mx-auto py-10" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <Navigation currentWeekStart={currentWeekStart} navigateWeek={navigateWeek} />
      <Table className="border-collapse w-full">
        <TableHeader>
          <AllDayEvents calendarEvents={calendarEvents} currentWeekStart={currentWeekStart} days={days} setShowCalendarEvent={setShowCalendarEvent}
          />
          <DisplayDates currentWeekStart={currentWeekStart} days={days} />
        </TableHeader>

        <TableBody>
          {hours.map((hour) => (
            <TableHour
              setShowCalendarEvent={setShowCalendarEvent}
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
      {isPopupOpen &&
        <CalendarDialog
          goals={goals}
          handleCreateEvent={handleCreateEvent}
          isPopupOpen={isPopupOpen}
          selectedSlots={selectedSlots}
          setIsPopupOpen={handleClosePopup}
        />
      }
      {showCalendarEvent &&
        <CalendarShowDialog
          handleUpdateCalendarEvent={handleUpdateCalendarEvent}
          setIsPopupOpen={setShowCalendarEvent}
          calendarEvent={showCalendarEvent}
        />
      }
    </div>
  )
}