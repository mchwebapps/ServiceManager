import type { OrderListDevice } from "@/modules/service/api/contracts/order/list/OrderListDevice"

export class OrderList {
  id!: number
  rma!: string
  customerId!: string
  customerName!: string
  device!: OrderListDevice
  workerId!: number
  workerName!: string
  status!: string
}
