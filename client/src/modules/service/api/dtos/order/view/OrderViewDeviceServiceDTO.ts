import type { OrderViewDeviceServiceParameterDTO } from "@/modules/service/api/dtos/order/view/OrderViewDeviceServiceParameterDTO"
import type { OrderViewDeviceServiceActionDTO } from "@/modules/service/api/dtos/order/view/OrderViewDeviceServiceActionDTO"

export class OrderViewDeviceServiceDTO {
  id!: number
  orderId!: number
  name!: string
  parameters!: OrderViewDeviceServiceParameterDTO[]
  actions!: OrderViewDeviceServiceActionDTO[]
}