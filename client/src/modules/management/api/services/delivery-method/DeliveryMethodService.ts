import { inject, injectable } from "tsyringe"
import type { IManagementApiService } from "@/modules/management/services/IManagementApiService"
import { DeliveryMethod } from "@/modules/management/api/contracts/delivery-method/DeliveryMethod"
import { DeliveryMethodDTO } from "@/modules/management/api/dtos/delivery-method/DeliveryMethodDTO"

export interface IDeliveryMethodService {
  getDeliveryMethods(): Promise<DeliveryMethodDTO[]>
  getDeliveryMethod(deliveryId: number): Promise<DeliveryMethodDTO>
  createDeliveryMethod(data: DeliveryMethodDTO): Promise<void>
  updateDeliveryMethod(deliveryId: number, data: DeliveryMethodDTO): Promise<void>
  deleteDeliveryMethod(deliveryId: number): Promise<void>
}

@injectable()
export class DeliveryMethodService implements IDeliveryMethodService {

  private _managementApiService: IManagementApiService

  constructor(@inject('IManagementApiService') managementApiService: IManagementApiService) {
    this._managementApiService = managementApiService
  }

  async getDeliveryMethods(): Promise<DeliveryMethodDTO[]> {
    const url = 'http://localhost:4000/deliveryMethods'
    const response = await this._managementApiService.get<DeliveryMethod[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new DeliveryMethodDTO
      result.id = item.id
      result.name = item.name
      return result
    })
  }

  async getDeliveryMethod(deliveryId: number): Promise<DeliveryMethodDTO> {
    const url = `http://localhost:4000/deliveryMethods/${deliveryId}`
    const response = await this._managementApiService.get<DeliveryMethod>(url)
    const data = response.data
    const result = new DeliveryMethodDTO
    result.id = data.id
    result.name = data.name
    return result
  }

  async createDeliveryMethod(data: DeliveryMethodDTO): Promise<void> {
    const item = new DeliveryMethod
    item.id = data.id
    item.name = data.name

    const url = `http://localhost:4000/deliveryMethods`
    await this._managementApiService.post(url, item)
  }

  async updateDeliveryMethod(deliveryId: number, data: DeliveryMethodDTO): Promise<void> {
    const item = new DeliveryMethod
    item.name = data.name

    const url = `http://localhost:4000/deliveryMethods/${deliveryId}`
    await this._managementApiService.put(url, item)
  }

  async deleteDeliveryMethod(deliveryId: number): Promise<void> {
    const url = `http://localhost:4000/deliveryMethods/${deliveryId}`
    await this._managementApiService.delete(url)
  }
}