import { format } from 'date-fns'

export const isSameDate = (firstDate: Date, secondDate: Date) => {
  return format(firstDate, 'dd/MM/yyyy mm:ss') === format(secondDate, 'dd/MM/yyyy mm:ss')
}
