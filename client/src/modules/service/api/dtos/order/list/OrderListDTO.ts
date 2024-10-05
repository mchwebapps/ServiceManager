import type { OrderListDeviceDTO } from "@/modules/service/api/dtos/order/list/OrderListDeviceDTO"

export class OrderListDTO {
  id!: number
  rma!: string
  customerId!: string
  customerName!: string
  device!: OrderListDeviceDTO
  workerId!: number
  workerName!: string
  status!: string
}
