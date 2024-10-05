import type { OrderCreateDevice } from "@/modules/service/api/contracts/order/create/OrderCreateDevice"

export class OrderCreate {
  rma!: string
  departmentId!: number
  customerId!: string
  customerBillingId!: number | undefined
  customerShippingId!: number | undefined
  customerContactId!: number | undefined
  devices!: OrderCreateDevice[]
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
