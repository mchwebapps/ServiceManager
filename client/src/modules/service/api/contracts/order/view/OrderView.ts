import type { OrderViewDevice } from "@/modules/service/api/contracts/order/view/OrderViewDevice"

export class OrderView {
  id!: number
  rma!: string
  customerId!: string
  customerName!: string
  statusId!: number
  admissionDate!: string
  deadline!: string
  priority!: string
  device!: OrderViewDevice
  notes!: Array<any>

  _salesDocument!: string
  _paymentTerm!: string
  _payment!: number
  _delivery!: string
}
