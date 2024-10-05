import type { OrderViewDeviceServiceParameter } from "@/modules/service/api/contracts/order/view/OrderViewDeviceServiceParameter"
import type { OrderViewDeviceServiceAction } from "@/modules/service/api/contracts/order/view/OrderViewDeviceServiceAction"

export class OrderViewDeviceService {
  id!: number
  orderId!: number
  name!: string
  parameters!: OrderViewDeviceServiceParameter[]
  actions!: OrderViewDeviceServiceAction[]
}