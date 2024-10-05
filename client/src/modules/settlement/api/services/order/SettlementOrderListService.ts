import { inject, injectable } from "tsyringe"
import type { ISettlementApiService } from "@/modules/settlement/services/ISettlementApiService"
import type { SettlementOrderList } from "@/modules/settlement/api/contracts/order/list/SettlementOrderList"
import { SettlementOrderListDTO } from "@/modules/settlement/api/dtos/order/list/SettlementOrderListDTO"

export interface ISettlementOrderListService {
  getOrders(): Promise<SettlementOrderListDTO[]>
  deleteOrder(orderId: string): Promise<void>
}

@injectable()
export class SettlementOrderListService implements ISettlementOrderListService {

  private _settlementApiService: ISettlementApiService

  constructor(@inject('ISettlementApiService') settlementApiService: ISettlementApiService) {
    this._settlementApiService = settlementApiService
  }

  async getOrders(): Promise<SettlementOrderListDTO[]> {
    const url = 'http://localhost:4000/settlementOrderList'
    const response = await this._settlementApiService.get<SettlementOrderList[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new SettlementOrderListDTO
      result.id = item.id
      result.nr = item.nr
      result.customerId = item.customerId
      result.customerName = item.customerName
      result.products = item.products
      result.priceWithTax = item.priceWithTax
      result.deliveryId = item.deliveryId
      result.deliveryName = item.deliveryName
      result.date = item.date
      return result
    })
  }

  async deleteOrder(orderId: string): Promise<void> {
    console.log('do zrobienia')
  }
}