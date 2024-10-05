import type { OrderListDeviceParameter } from "@/modules/service/api/contracts/order/list/OrderListDeviceParameter"

export class OrderListDevice {
  id!: number
  type!: string
  parameters!: OrderListDeviceParameter[]
}
