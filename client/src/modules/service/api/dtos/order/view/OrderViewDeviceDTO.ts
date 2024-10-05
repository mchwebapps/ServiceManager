import type { OrderViewDeviceParameterDTO } from "@/modules/service/api/dtos/order/view/OrderViewDeviceParameterDTO"
import type { OrderViewDeviceServiceDTO } from "@/modules/service/api/dtos/order/view/OrderViewDeviceServiceDTO"

export class OrderViewDeviceDTO {
  id!: number
  type!: string
  parameters!: OrderViewDeviceParameterDTO[]
  services!: OrderViewDeviceServiceDTO[]
}