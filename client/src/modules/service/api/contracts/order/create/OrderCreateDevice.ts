import type { OrderCreateDeviceParameter } from "@/modules/service/api/contracts/order/OrderCreateDeviceParameter"
import type { OrderCreateDeviceService } from "@/modules/service/api/contracts/order/OrderCreateDeviceService"

export class OrderCreateDevice {
  id!: number
  deviceTypeId!: number
  parameters!: OrderCreateDeviceParameter[]
  services!: OrderCreateDeviceService[]
  admissionDate!: string
  deadline!: string
  paymentTerm!: string
  workerId: number = 0
}
