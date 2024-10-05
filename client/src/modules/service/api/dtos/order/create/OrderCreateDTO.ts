import type { OrderCreateDeviceDTO } from "@/modules/service/api/dtos/order/create/OrderCreateDeviceDTO"

export class OrderCreateDTO {
  rma!: string
  departmentId!: number
  customerId!: string
  customerBillingId!: number | undefined
  customerShippingId!: number | undefined
  customerContactId!: number | undefined
  devices!: OrderCreateDeviceDTO[]
  deliveryMethod!: number
  shippingMethod!: number
  shippingCost!: number
  documentType!: number
  paymentMethod!: number
  priceNoTax!: number
  paid!: number
  priceWithTax!: number
  comment!: string
}
