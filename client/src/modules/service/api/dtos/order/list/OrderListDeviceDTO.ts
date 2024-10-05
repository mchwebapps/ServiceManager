import type { OrderListDeviceParameterDTO } from "@/modules/service/api/dtos/order/list/OrderListDeviceParameter"

export class OrderListDeviceDTO {
  id!: number
  type!: string
  parameters!: OrderListDeviceParameterDTO[]
}
