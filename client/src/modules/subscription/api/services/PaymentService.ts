import payments from '@/modules/subscription/api/data/payments.json'
import { PaymentDTO } from '@/modules/subscription/api/dtos/PaymentDTO'
import type { Payment } from '@/modules/subscription/api/contracts/Payment'

export class PaymentService {
  getPayments(): PaymentDTO[] {
    const paymentsData = payments as Payment[]
    const pays = new Array<PaymentDTO>()

    for (let i = 0; i < paymentsData.length; i++) {
      const tmp = new PaymentDTO()

      tmp.id = payments[i].id
      tmp.moduleId = payments[i].moduleId
      tmp.subscriptionType = payments[i].subscriptionType
      tmp.date = payments[i].date
      tmp.price = payments[i].price
      tmp.currency = payments[i].currency
      tmp.billing = payments[i].billing
      tmp.status = payments[i].status

      pays.push(tmp)
    }
    return pays
  }
}
