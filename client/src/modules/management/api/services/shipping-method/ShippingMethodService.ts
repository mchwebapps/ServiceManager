import { inject, injectable } from "tsyringe"
import type { IManagementApiService } from "@/modules/management/services/IManagementApiService"
import { ShippingMethod } from "@/modules/management/api/contracts/shipping-method/ShippingMethod"
import { ShippingMethodDTO } from "@/modules/management/api/dtos/shipping-method/ShippingMethodDTO"

export interface IShippingMethodService {
  getShippingMethods(): Promise<ShippingMethodDTO[]>
  getShippingMethod(shippingId: number): Promise<ShippingMethodDTO>
  createShippingMethod(data: ShippingMethodDTO): Promise<void>
  updateShippingMethod(shippingId: number, data: ShippingMethodDTO): Promise<void>
  deleteShippingMethod(shippingId: number): Promise<void>
}

@injectable()
export class ShippingMethodService implements IShippingMethodService {

  private _managementApiService: IManagementApiService

  constructor(@inject('IManagementApiService') managementApiService: IManagementApiService) {
    this._managementApiService = managementApiService
  }

  async getShippingMethods(): Promise<ShippingMethodDTO[]> {
    const url = 'http://localhost:4000/shippingMethods'
    const response = await this._managementApiService.get<ShippingMethod[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new ShippingMethodDTO
      result.id = item.id
      result.name = item.name
      return result
    })    
  }

  async getShippingMethod(shippingId: number): Promise<ShippingMethodDTO> {
    const url = `http://localhost:4000/shippingMethods/${shippingId}`
    const response = await this._managementApiService.get<ShippingMethod>(url)
    const data = response.data
    const result = new ShippingMethodDTO
    result.id = data.id
    result.name = data.name
    return result
  }

  async createShippingMethod(data: ShippingMethodDTO): Promise<void> {
    const item = new ShippingMethod
    item.id = data.id
    item.name = data.name

    const url = `http://localhost:4000/shippingMethods`
    await this._managementApiService.post(url, item)
  }

  async updateShippingMethod(shippingId: number, data: ShippingMethodDTO): Promise<void> {
    const item = new ShippingMethod
    item.name = data.name

    const url = `http://localhost:4000/shippingMethods/${shippingId}`
    await this._managementApiService.put(url, item)
  }

  async deleteShippingMethod(shippingId: number): Promise<void> {
    const url = `http://localhost:4000/shippingMethods/${shippingId}`
    await this._managementApiService.delete(url)
  }
}