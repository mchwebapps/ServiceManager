export class SettlementOrderListDTO {
  id!: number
  nr!: string
  customerId!: string
  customerName!: string
  products!: Array<{}>
  priceWithTax!: number
  deliveryId!: number
  deliveryName!: string
  date!: string
}
