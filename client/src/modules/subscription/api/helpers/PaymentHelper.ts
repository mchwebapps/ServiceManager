import { PaymentMethods, PaymentStatuses } from '@/modules/subscription/api/enums/StoreEnums'

export class PaymentHelper {
  static getPaymentMethodName(type: PaymentMethods) {
    switch (type) {
      case PaymentMethods.BankTransfer:
        return 'Przelew elektroniczny'
      case PaymentMethods.Cash:
        return 'Gotówka'
      default:
        return ''
    }
  }

  static getPaymentStatusName(type: PaymentStatuses) {
    switch (type) {
      case PaymentStatuses.Paid:
        return 'Zapłacono'
      case PaymentStatuses.Cancelled:
        return 'Odrzucono'
      default:
        return ''
    }
  }

  static getPaymentStatusBadgeClass(status: PaymentStatuses) {
    switch (status) {
      case PaymentStatuses.Paid:
        return 'badge bg-success'
      case PaymentStatuses.Cancelled:
        return 'badge bg-danger'
      default:
        return ''
    }
  }
}
