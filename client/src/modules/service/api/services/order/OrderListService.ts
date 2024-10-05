import { inject, injectable } from "tsyringe"
import type { IServiceApiService } from "@/modules/service/services/IServiceApiService"
import type { OrderList } from "@/modules/service/api/contracts/order/list/OrderList"
import { OrderListDTO } from "@/modules/service/api/dtos/order/list/OrderListDTO"

export interface IOrderListService {
  getOrders(): Promise<OrderListDTO[]>
  deleteOrder(orderId: string): Promise<void>
}

@injectable()
export class OrderListService implements IOrderListService {

  private _serviceApiService: IServiceApiService

  constructor(@inject('IServiceApiService') serviceApiService: IServiceApiService) {
    this._serviceApiService = serviceApiService
  }

  async getOrders(): Promise<OrderListDTO[]> {
    const url = 'http://localhost:4000/orderList'
    const response = await this._serviceApiService.get<OrderList[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new OrderListDTO
      result.id = item.id
      result.rma = item.rma
      result.customerId = item.customerId
      result.customerName = item.customerName
      result.device = item.device
      result.workerId = item.workerId
      result.workerName = item.workerName
      result.status = item.status
      return result
    })
  }

  async deleteOrder(orderId: string): Promise<void> {
    console.log('do zrobienia')
  }
}