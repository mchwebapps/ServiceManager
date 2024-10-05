import { SubscriptionStatuses } from '@/modules/subscription/api/enums/StoreEnums'

export class SubscriptionStatusHelper {
  static getSubscriptionStatusName(subscriptionStatus: SubscriptionStatuses) {
    switch (subscriptionStatus) {
      case SubscriptionStatuses.Inactive:
        return 'Nieaktywny'
      case SubscriptionStatuses.Active:
        return 'Aktywny'
      case SubscriptionStatuses.Ended:
        return 'Zakończony'
      default:
        return ''
    }
  }

  static getSubscriptionStatusBadgeClass(
    subscriptionStatus: SubscriptionStatuses
  ) {
    switch (subscriptionStatus) {
      case SubscriptionStatuses.Inactive:
        return 'badge bg-light'
      case SubscriptionStatuses.Active:
        return 'badge bg-success'
      case SubscriptionStatuses.Ended:
        return 'badge bg-danger'
      default:
        return ''
    }
  }
}
