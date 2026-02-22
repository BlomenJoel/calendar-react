"use client"

import { getTimeDate } from "@/app/utils/dateFormat"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Input } from "../input"
import { Button } from "@/components/ui/button"
import { Goal } from "@/app/utils/types"
import { useEffect, useState } from "react"
import { event } from "../../../../lib/schemas"
import { useIsMobile } from "@/app/hooks/useIsMobile"

type Slot = { hour: number; date: Date; minute: number }

type Props = {
  isPopupOpen: boolean
  setIsPopupOpen: (val: boolean) => void
  selectedSlots: Slot[]
  goals: Goal[]
  handleCreateEvent: (data: typeof event.$inferInsert) => void
}

function EventFormContent(props: {
  title: string
  setTitle: (v: string) => void
  allDayEvent: boolean
  setAllDayEvent: (v: boolean) => void
  startDate?: string
  setStartDate: (v: string) => void
  endDate?: string
  setEndDate: (v: string) => void
  associatedGoal?: string
  setAssociatedGoal: (v: string) => void
  goals: Goal[]
  onSubmit: () => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <Input.Text label="Title" value={props.title} setValue={props.setTitle} />
      <Input.CheckBox
        label="All day event"
        value={props.allDayEvent}
        setValue={props.setAllDayEvent}
      />
      {!props.allDayEvent && (
        <Input.TimeDate
          label="Start"
          value={props.startDate}
          setValue={(v) => props.setStartDate(v)}
        />
      )}
      {!props.allDayEvent && (
        <Input.TimeDate
          label={undefined}
          value={props.endDate}
          setValue={(v) => props.setEndDate(v)}
        />
      )}
      <Input.Select
        options={props.goals.map((goal) => ({ label: goal.title, val: goal.id }))}
        label="Associated goal"
        onChange={props.setAssociatedGoal}
      />
      <Button
        className="w-full sm:w-auto"
        onClick={props.onSubmit}
      >
        Create event
      </Button>
    </div>
  )
}

export function CalendarDialog(props: Props) {
  const [startDate, setStartDate] = useState<string>()
  const [endDate, setEndDate] = useState<string>()
  const [title, setTitle] = useState("")
  const [allDayEvent, setAllDayEvent] = useState(false)
  const [associatedGoal, setAssociatedGoal] = useState<string>()
  const isMobile = useIsMobile()

  useEffect(() => {
    const dates = [...props.selectedSlots].sort(
      (a, b) =>
        a.date.getTime() - b.date.getTime() || a.hour - b.hour || a.minute - b.minute
    )
    if (dates.length > 0) {
      const start = new Date(dates[0].date)
      start.setHours(dates[0].hour)
      start.setMinutes(dates[0].minute)

      const end = new Date(dates[dates.length - 1].date)
      end.setHours(dates[dates.length - 1].hour)
      end.setMinutes(dates[dates.length - 1].minute)
      end.setMinutes(end.getMinutes() + 30)

      setStartDate(getTimeDate(start))
      setEndDate(getTimeDate(end))
    }
  }, [props.selectedSlots])

  const handleSubmit = () => {
    if (endDate && startDate) {
      props.handleCreateEvent({
        title,
        allDay: allDayEvent,
        end: new Date(endDate),
        start: new Date(startDate),
        goalId: associatedGoal,
      })
    }
  }

  const formProps = {
    title,
    setTitle,
    allDayEvent,
    setAllDayEvent,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    associatedGoal,
    setAssociatedGoal,
    goals: props.goals,
    onSubmit: handleSubmit,
  }

  if (isMobile) {
    return (
      <Sheet open={props.isPopupOpen} onOpenChange={props.setIsPopupOpen}>
        <SheetContent side="bottom" className="max-h-[90dvh] overflow-y-auto rounded-t-2xl pb-8">
          <SheetHeader>
            <SheetTitle>Add Event</SheetTitle>
            <SheetDescription>
              Create a new event for the selected time slots
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <EventFormContent {...formProps} />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={props.isPopupOpen} onOpenChange={props.setIsPopupOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
          <DialogDescription>
            Create a new event for the selected time slots
          </DialogDescription>
        </DialogHeader>
        <EventFormContent {...formProps} />
      </DialogContent>
    </Dialog>
  )
}