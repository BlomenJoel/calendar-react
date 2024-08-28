import { formatDate } from "@/app/utils/dateFormat"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Props = {
    currentWeekStart: Date
    navigateWeek: (direction: 'prev' | 'next') => void
}

export function Navigation({currentWeekStart, navigateWeek}: Props) {
    return (
        <div className="flex justify-between items-center mb-4">
        <Button onClick={() => navigateWeek('prev')} variant="outline" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {formatDate(currentWeekStart)} - {formatDate(new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000))}
        </h2>
        <Button onClick={() => navigateWeek('next')} variant="outline" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
}