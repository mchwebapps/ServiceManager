import type { OrderViewDeviceDTO } from "@/modules/service/api/dtos/order/view/OrderViewDeviceDTO"

export class OrderViewDTO {
  id!: number
  rma!: string
  customerId!: string
  customerName!: string
  statusId!: number
  admissionDate!: string
  deadline!: string
  priority!: string
  device!: OrderViewDeviceDTO
  notes!: Array<any>

  _salesDocument!: string
  _paymentTerm!: string
  _payment!: number
  _delivery!: string
}
