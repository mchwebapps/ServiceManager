import type { OrderWizardDeviceDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardDeviceDTO"

export class OrderWizardDTO {
  rma!: string
  departmentId!: number
  customerId!: string
  customerBillingId!: number | undefined
  customerShippingId!: number | undefined
  customerContactId!: number | undefined
  devices!: OrderWizardDeviceDTO[]
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
