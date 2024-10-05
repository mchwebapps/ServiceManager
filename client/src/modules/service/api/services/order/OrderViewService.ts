

import type { AxiosResponse } from "axios"
import { inject, injectable } from "tsyringe"
import type { IServiceApiService } from "@/modules/service/services/IServiceApiService"
import type { OrderView } from "@/modules/service/api/contracts/order/view/OrderView"
import type { OrderViewHistory } from "@/modules/service/api/contracts/order/view/OrderViewHistory"
import { OrderViewDTO } from "@/modules/service/api/dtos/order/view/OrderViewDTO"
import { OrderViewHistoryDTO } from "@/modules/service/api/dtos/order/view/OrderViewHistoryDTO"
import { OrderViewDeviceServiceParameterDTO } from "@/modules/service/api/dtos/order/view/OrderViewDeviceServiceParameterDTO"
import { OrderViewDeviceServiceDTO } from "@/modules/service/api/dtos/order/view/OrderViewDeviceServiceDTO"
import { OrderViewNoteDTO } from "@/modules/service/api/dtos/order/view/OrderViewNoteDTO"

export interface IOrderViewService {
  getOrder(orderId: number): Promise<OrderViewDTO>
  getOrderHistory(orderId: number): Promise<OrderViewHistoryDTO[]>
  getOrderDeviceService(orderId: number, serviceId: number): Promise<OrderViewDeviceServiceDTO>
  getOrderNotes(orderId: number): Promise<OrderViewNoteDTO[]>

  updateOrderDeviceParameters(
    orderId: number,
    data: OrderViewDeviceServiceParameterDTO[]
  ): Promise<void>

  updateOrderDeviceServices(
    orderId: number,
    data: OrderViewDeviceServiceDTO[]
  ): Promise<void>

  getOrderDeadline(orderId: number): Promise<string>
  setOrderDeadline(orderId: number, date: string): Promise<void>
  setOrderPriority(orderId: number, priority: string): Promise<void>
}

@injectable()
export class OrderViewService implements IOrderViewService {

  private _serviceApiService: IServiceApiService

  constructor(@inject('IServiceApiService') serviceApiService: IServiceApiService) {
    this._serviceApiService = serviceApiService
  }

  async getOrder(orderId: number): Promise<OrderViewDTO> {
    const url = `http://localhost:4000/orderView/${orderId}`
    const response = await this._serviceApiService.get<OrderView>(url)
    const data = response.data
    const result = new OrderViewDTO

    if (data) {
      result.id = data.id
      result.rma = data.rma
      result.customerId = data.customerId
      result.customerName = data.customerName
      result.statusId = data.statusId
      result.admissionDate = data.admissionDate
      result.deadline = data.deadline
      result.priority = data.priority
      result.device = data.device
      result.notes = data.notes

      result._salesDocument = data._salesDocument
      result._paymentTerm = data._paymentTerm
      result._payment = data._payment
      result._delivery = data._delivery
    }
    return result
  }

  async getOrderHistory(orderId: number): Promise<OrderViewHistoryDTO[]> {
    const url = `http://localhost:4000/orderHistory?orderId=${orderId}`
    const response = await this._serviceApiService.get<OrderViewHistory[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new OrderViewHistoryDTO
      result.id = item.id
      result.date = item.date
      result.name = item.name
      result.text = item.text
      return result
    })
  }

  async getOrderDeviceService(orderId: number, serviceId: number): Promise<OrderViewDeviceServiceDTO> {
    const url = `http://localhost:4000/orderView/${orderId}`
    const response = await this._serviceApiService.get<OrderView>(url)
    const data = response.data
    let result = new OrderViewDeviceServiceDTO
    result = data.device.services.find(item => item.id == serviceId) ?? new OrderViewDeviceServiceDTO
    return result
  }

  async getOrderNotes(orderId: number): Promise<OrderViewNoteDTO[]> {
    const url = `http://localhost:4000/orderView/${orderId}`
    const response = await this._serviceApiService.get<OrderView>(url)
    const data = response.data
    
    return data.notes.map((item) => {
      const result = new OrderViewNoteDTO
      result.id = item.id
      result.date = item.date
      result.text = item.text
      result.author = item.author
      return result
    })
  }

  async updateOrderDeviceParameters(
    orderId: number,
    data: OrderViewDeviceServiceParameterDTO[]
  ): Promise<void> {

    const requests: Promise<AxiosResponse<any>>[] = []

    for (let i = 0; i < data.length; i++) {
      const item = new OrderViewDeviceServiceParameterDTO
      item.id = data[i].id
      item.name = data[i].name

      const url = `${orderId}`
      requests.push(this._serviceApiService.post(url, item))
    }
    console.log('do zrobienia')
    await Promise.all(requests)
  }

  async updateOrderDeviceServices(
    orderId: number,
    data: OrderViewDeviceServiceDTO[]
  ): Promise<void> {

    const requests: Promise<AxiosResponse<any>>[] = []

    for (let i = 0; i < data.length; i++) {
      const item = new OrderViewDeviceServiceDTO
      item.id = data[i].id
      item.name = data[i].name

      const url = `${orderId}`
      requests.push(this._serviceApiService.post(url, item))
    }
    console.log('do zrobienia')
    await Promise.all(requests)
  }

  
  async getOrderDeadline(orderId: number): Promise<string> {
    const url = `http://localhost:4000/orderView/${orderId}`
    const response = await this._serviceApiService.get<OrderViewDTO>(url)
    const data = response.data
    return data.deadline
  }

  async setOrderDeadline(orderId: number, date: string): Promise<void> {
    const result = new OrderViewDTO
    result.deadline = date

    const url = `http://localhost:4000/orderView/${orderId}`
    await this._serviceApiService.patch(url, result)
  }

  async setOrderPriority(orderId: number, priority: string): Promise<void> {
    const result = new OrderViewDTO
    result.priority = priority

    const url = `http://localhost:4000/orderView/${orderId}`
    await this._serviceApiService.patch(url, result)
  }
}