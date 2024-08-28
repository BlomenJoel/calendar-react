'use client'
import { useState, useRef, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatDate } from "@/app/utils/dateFormat"
import { CalendarDialog } from "./dialog"
import { Navigation } from "./navigation"
import { TableHour } from "./tableHour"
import { CalendarEvent, Goal } from "@/app/utils/types"
import { event } from "../../../../lib/schemas"

export type SelectedSlot = {
  date: Date
  hour: number
  minute: number
}

type Props = {
  calendarEvents: CalendarEvent[],
  goals: Goal[],
  createCalendarEvent: (params: typeof event.$inferInsert) => Promise<void>
}

export default function NewCalendarTable({ calendarEvents, goals, createCalendarEvent }: Props) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date()
    const day = today.getDay()
    return new Date(today.setDate(today.getDate() - day + (day === 0 ? -6 : 1)))
  })
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const startSlotRef = useRef<SelectedSlot | null>(null)


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

  return (
    <div className="container mx-auto py-10" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <Navigation currentWeekStart={currentWeekStart} navigateWeek={navigateWeek} />
      <Table className="border-collapse w-full">
        <TableHeader>
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
              events={calendarEvents}
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