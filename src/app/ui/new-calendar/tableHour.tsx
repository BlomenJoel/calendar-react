'use client'
import { TableCell, TableRow } from "@/components/ui/table"
import { SelectedSlot } from "./new-calendar"
import { cn } from "@/lib/utils"
import { Dispatch, MutableRefObject, SetStateAction, useCallback } from "react"
import { CalendarEvent } from "@/app/utils/types"

type Props = {
    hour: number, 
    days: string[], 
    currentWeekStart: Date, 
    selectedSlots: SelectedSlot[], 
    events: CalendarEvent[], 
    setSelectedSlots: Dispatch<SetStateAction<SelectedSlot[]>>, 
    setIsDragging: (isDragging: boolean) => void,
    startSlotRef: MutableRefObject<SelectedSlot | null>
    isDragging: boolean
}

export function TableHour({ hour, days, currentWeekStart, selectedSlots, events, setSelectedSlots, setIsDragging, startSlotRef, isDragging }: Props) {

    const handleSlotSelection = useCallback((date: Date, hour: number, minute: number) => {
        setSelectedSlots(prev => {
            const newSlot = { date, hour, minute }
            const isAlreadySelected = prev.some(
                slot => slot.date.getTime() === date.getTime() && slot.hour === hour && slot.minute === minute
            )

            if (isAlreadySelected) {
                return prev.filter(slot => !(slot.date.getTime() === date.getTime() && slot.hour === hour && slot.minute === minute))
            } else {
                return [...prev, newSlot]
            }
        })
    }, [])

    const handleMouseDown = (date: Date, hour: number, minute: number) => {
        setIsDragging(true)
        startSlotRef.current = { date, hour, minute }
        handleSlotSelection(date, hour, minute)
    }

    const handleMouseEnter = (date: Date, hour: number, minute: number) => {
        if (isDragging && startSlotRef.current) {
            const startDate = startSlotRef.current.date
            const endDate = date
            const startTime = startSlotRef.current.hour * 60 + startSlotRef.current.minute
            const endTime = hour * 60 + minute

            const newSelectedSlots: SelectedSlot[] = []

            for (let d = new Date(Math.min(startDate.getTime(), endDate.getTime()));
                d <= new Date(Math.max(startDate.getTime(), endDate.getTime()));
                d.setDate(d.getDate() + 1)) {
                const dayStartTime = d.getTime() === startDate.getTime() ? startTime : 0
                const dayEndTime = d.getTime() === endDate.getTime() ? endTime : 24 * 60 - 1

                for (let t = Math.min(dayStartTime, dayEndTime); t <= Math.max(dayStartTime, dayEndTime); t += 30) {
                    newSelectedSlots.push({ date: new Date(d), hour: Math.floor(t / 60), minute: t % 60 })
                }
            }

            setSelectedSlots(newSelectedSlots)
        }
    }


    const isEventInSlot = (date: Date, hour: number, minute: number) => {
        return events.some(event => {
            const slotStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute)
            const slotEnd = new Date(slotStart.getTime() + 30 * 60000)
            return slotStart < event.end && slotEnd > event.start
        })
    }

    return (
        <TableRow key={hour}>
            <TableCell className="font-medium">
                {hour.toString().padStart(2, '0')}:00
            </TableCell>
            {days.map((day, index) => {
                const date = new Date(currentWeekStart)
                date.setDate(currentWeekStart.getDate() + index)
                return (
                    <TableCell
                        key={`${day}-${hour}`}
                        className={cn(
                            "border-t border-gray-200 p-0 h-12 cursor-pointer select-none",
                            index < days.length - 1 && "border-r border-gray-200"
                        )}
                        role="gridcell"
                    >
                        {[0, 30].map(minute => (
                            <div
                                key={`${day}-${hour}-${minute}`}
                                className={cn(
                                    "w-full h-1/2",
                                    selectedSlots.some(slot =>
                                        slot.date.getTime() === date.getTime() &&
                                        slot.hour === hour &&
                                        slot.minute === minute
                                    ) && "bg-primary/20",
                                    isEventInSlot(date, hour, minute) && "bg-blue-500/50"
                                )}
                                onMouseDown={() => handleMouseDown(date, hour, minute)}
                                onMouseEnter={() => handleMouseEnter(date, hour, minute)}
                                aria-selected={selectedSlots.some(slot =>
                                    slot.date.getTime() === date.getTime() &&
                                    slot.hour === hour &&
                                    slot.minute === minute
                                )}
                            />
                        ))}
                    </TableCell>
                )
            })}
        </TableRow>
    )
}