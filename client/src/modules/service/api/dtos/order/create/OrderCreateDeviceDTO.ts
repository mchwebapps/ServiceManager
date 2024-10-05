import type { OrderCreateDeviceParameterDTO } from "@/modules/service/api/dtos/order/create/OrderCreateDeviceParameterDTO"
import type { OrderCreateDeviceServiceDTO } from "@/modules/service/api/dtos/order/create/OrderCreateDeviceServiceDTO"

export class OrderCreateDeviceDTO {
  id!: number
  deviceTypeId!: number
  parameters!: OrderCreateDeviceParameterDTO[]
  services!: OrderCreateDeviceServiceDTO[]
  admissionDate!: string
  deadline!: string
  paymentTerm!: string
  workerId: number = 0
}
