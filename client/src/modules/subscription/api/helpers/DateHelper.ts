import { ref } from 'vue'

export class DateHelper {
  static countDaysBetweenDates(endDate: string): number {
    const startDate = new Date()
    const startDateYear = startDate.getFullYear()
    const startDateMonth = startDate.getMonth()
    const startDateDay = startDate.getDate()

    const splittedEndDate: string[] = endDate.split('.')

    const endDateDay = splittedEndDate[0]
    const endDateMonth = splittedEndDate[1]
    const endDateYear = splittedEndDate[2]

    const newStartDate: Date = new Date(
      startDateMonth + '/' + startDateDay + '/' + startDateYear
    )
    const newEndDate: Date = new Date(
      endDateMonth + '/' + endDateDay + '/' + endDateYear
    )

    const timeDifference: number =
      newEndDate.valueOf() - newStartDate.valueOf()
    const daysDifference: number = Math.ceil(
      timeDifference / (1000 * 3600 * 24)
    )
    return daysDifference
  }

  static formatDate(date: string): string {
    const dateTime = new Date(date)
    const day = dateTime.getDate()
    const month = dateTime.getMonth() < 10 ? `0${dateTime.getMonth() + 1}` : dateTime.getMonth() + 1
    const year = dateTime.getFullYear()
    return `${day}.${month}.${year}`
  }

  static daysDifference(endDate: string) {
    const start: Date = new Date()
    const end: Date = new Date(endDate)
    const timeDifference: number = Math.abs(end.valueOf() - start.valueOf())
    let daysDifference: number = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) 

    if (daysDifference < 0) { daysDifference = 0 }
    
    const days = daysDifference === 1 ? `${daysDifference} dzień` : `${daysDifference} dni`
    return days
  }

  static checkSubscriptionDates = (subscriptionStartDate: string, subscriptionEndDate: string, subscriptionNextPaymentDate: string) => {
    let renewSubscriptionButton = ref<boolean>()
    let changeSubscriptionButton = ref<boolean>()
    let extendSubscriptionButton = ref<boolean>()
    const currentDate = new Date()
    const startDate = new Date(subscriptionStartDate)
    const endDate = new Date(subscriptionEndDate) === null ? new Date(0) : new Date(subscriptionEndDate)
    const nextPaymentDate = new Date(subscriptionNextPaymentDate) === null ? new Date(0) : new Date(subscriptionNextPaymentDate)
    let subscriptionStatus = ''

    if (endDate && endDate > currentDate) {
      renewSubscriptionButton.value = false
      changeSubscriptionButton.value = true
      extendSubscriptionButton.value = true
      return 'Aktywny'
    }
    renewSubscriptionButton.value = false
    changeSubscriptionButton.value = true
    extendSubscriptionButton.value = true
    return 'Nieaktywny'
  }
}
