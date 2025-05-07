import { Calendar } from '@/components/Calendar '
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles'
import { useState } from 'react'
import dayjs from 'dayjs'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'

interface Availabilit {
  possibleTimes: number[]
  availableTimes: number[]
}

export function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const router = useRouter()
  const username = String(router.query.username)

  const isDateSelected = !!selectedDate
  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describeDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ] MMMM')
    : null

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  const { data: availablity } = useQuery<Availabilit>({
    queryKey: ['availability', selectedDateWithoutTime],
    queryFn: async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        },
      })

      return response.data
    },
    enabled: !!selectedDate,
  })

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{describeDate}</span>
          </TimePickerHeader>

          <TimePickerList>
            {availablity?.possibleTimes.map((time) => {
              return (
                <TimePickerItem
                  key={time}
                  disabled={!availablity.availableTimes.includes(time)}
                >
                  {String(time).padStart(2, '0')}:00h
                </TimePickerItem>
              )
            })}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}
