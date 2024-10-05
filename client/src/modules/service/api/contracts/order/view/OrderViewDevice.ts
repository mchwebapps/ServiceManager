import type { OrderViewDeviceParameter } from "@/modules/service/api/contracts/order/view/OrderViewDeviceParameter"
import type { OrderViewDeviceService } from "@/modules/service/api/contracts/order/view/OrderViewDeviceService"

export class OrderViewDevice {
  id!: number
  type!: string
  parameters!: OrderViewDeviceParameter[]
  services!: OrderViewDeviceService[]
}