'use client'
import { TableCell, TableRow } from "@/components/ui/table"
import { SelectedSlot } from "./new-calendar"
import { cn } from "@/lib/utils"
import { Dispatch, MutableRefObject, SetStateAction, useCallback, useState } from "react"
import { CalendarEvent } from "@/app/utils/types"

type ChildProps = {
    hour: number,
    minute: number,
    day: string,
    date: Date,
    selectedSlots: SelectedSlot[],
    eventInSlot: CalendarEvent | undefined;
    eventLabel?: string | null;
    eventGoal?: string | null;
    handleMouseDown: (date: Date, hour: number, minute: number, eventInSlot: CalendarEvent | undefined) => void;
    handleMouseEnter: (date: Date, hour: number, minute: number) => void;
}

type ParentProps = {
    hour: number,
    days: string[],
    currentWeekStart: Date,
    selectedSlots: SelectedSlot[],
    events: CalendarEvent[] | undefined,
    setSelectedSlots: Dispatch<SetStateAction<SelectedSlot[]>>,
    setIsDragging: (isDragging: boolean) => void,
    startSlotRef: MutableRefObject<SelectedSlot | null>
    setShowCalendarEvent: Dispatch<SetStateAction<undefined | CalendarEvent>>,
    isDragging: boolean
}

export function TableHour({ hour, days, currentWeekStart, selectedSlots, events, setSelectedSlots, setIsDragging, startSlotRef, isDragging, setShowCalendarEvent }: ParentProps) {
    const getEventInSlot = (slotStart: Date, slotEnd: Date) => {
        return events?.find(event => {
            return slotStart < event.end && slotEnd > event.start
        })
    }

    const getEventsGoal = (foundEvent: CalendarEvent | undefined, slotEnd: Date) => {
        if (foundEvent?.start.getTime() === slotEnd.getTime()) {
            return foundEvent.goalTitle
        }
    }

    const getEventLabel = (foundEvent: CalendarEvent | undefined, slotStart: Date) => {
        if (foundEvent?.start.getTime() === slotStart.getTime()) {
            return foundEvent.title
        }
    }

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
    }, [setSelectedSlots])

    const handleMouseDown = (date: Date, hour: number, minute: number, eventInSlot: CalendarEvent | undefined) => {
        if (eventInSlot) {
            setShowCalendarEvent(eventInSlot)
        } else {
            setIsDragging(true)
            startSlotRef.current = { date, hour, minute }
            handleSlotSelection(date, hour, minute)
        }
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
                            "p-0 h-12 cursor-pointer select-none",
                            index < days.length - 1 && "border-r border-gray-200"
                        )}
                        role="gridcell"
                    >

                        {[0, 30].map(minute => {
                            const slotStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute)
                            const slotEnd = new Date(slotStart.getTime() + 30 * 60000)
                            const eventInSlot = getEventInSlot(slotStart, slotEnd)
                            const eventLabel = getEventLabel(eventInSlot, slotStart)
                            const eventGoal = getEventsGoal(eventInSlot, slotStart)
                            return (
                                <HourTableCell
                                    eventInSlot={eventInSlot}
                                    eventGoal={eventGoal}
                                    eventLabel={eventLabel}
                                    hour={hour}
                                    minute={minute}
                                    key={`${day}-${hour}-${minute}`}
                                    date={date}
                                    day={day}
                                    selectedSlots={selectedSlots}
                                    handleMouseDown={handleMouseDown}
                                    handleMouseEnter={handleMouseEnter}
                                />
                            )
                        })}
                    </TableCell>
                )
            })}
        </TableRow>
    )
}

const HourTableCell = (props: ChildProps) => {
    return (
        <div
            key={`${props.day}-${props.hour}-${props.minute}`}
            className={cn(
                "w-full h-1/2 relative z-10 p-1 overflow-hidden",
                props.selectedSlots.some(slot =>
                    slot.date.getTime() === props.date.getTime() &&
                    slot.hour === props.hour &&
                    slot.minute === props.minute
                ) && "bg-primary/20",
                props.eventInSlot && "bg-blue-500"
            )}
            style={props.eventInSlot?.goalColor ? { backgroundColor: props.eventInSlot.goalColor } : undefined}
            onMouseDown={() => props.handleMouseDown(props.date, props.hour, props.minute, props.eventInSlot)}
            onMouseEnter={() => props.handleMouseEnter(props.date, props.hour, props.minute)}
            aria-selected={props.selectedSlots.some(slot =>
                slot.date.getTime() === props.date.getTime() &&
                slot.hour === props.hour &&
                slot.minute === props.minute
            )}
        >
            {props.eventLabel && <h2>{props.eventLabel}</h2>}
        </div>
    )
}