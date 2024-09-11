import { formatDate } from "@/app/utils/dateFormat"
import { TableHead, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

type Props = {
    days: string[]
    currentWeekStart: Date
}

export const DisplayDates = ({ days, currentWeekStart }: Props) => {
    return (

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
    )
}