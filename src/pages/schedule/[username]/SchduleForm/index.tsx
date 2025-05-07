import { useState } from 'react'
import { CalendarStep } from './CalendarStep'
import { ConfirmStep } from './ConfirmStep'

export function ScheduleForm() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null)

  function handleCancelScheduling() {
    setSelectedDateTime(null)
  }

  if (selectedDateTime)
    return (
      <ConfirmStep
        schedulingDate={selectedDateTime}
        onCleanScheduling={handleCancelScheduling}
      />
    )

  return <CalendarStep onSelectedDateTime={setSelectedDateTime} />
}
