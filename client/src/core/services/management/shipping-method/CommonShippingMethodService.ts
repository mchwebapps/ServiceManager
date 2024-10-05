import { inject, injectable } from "tsyringe"
import type { IServiceApiService } from "@/modules/service/services/IServiceApiService"
import type { CommonShippingMethod } from "@/core/contracts/management/shipping-method/CommonShippingMethod"
import { ShippingMethodDTO } from "@/core/dtos/management/shipping-method/ShippingMethodDTO"

export interface ICommonShippingMethodService {
  getShippingMethods(): Promise<ShippingMethodDTO[]>
}

@injectable()
export class CommonShippingMethodService implements ICommonShippingMethodService {

  private _serviceApiService: IServiceApiService

  constructor(@inject('IServiceApiService') serviceApiService: IServiceApiService) {
    this._serviceApiService = serviceApiService
  }

  async getShippingMethods(): Promise<ShippingMethodDTO[]> {
    const url = 'http://localhost:4000/shippingMethods'
    const response = await this._serviceApiService.get<CommonShippingMethod[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new ShippingMethodDTO
      result.id = item.id
      result.name = item.name
      return result
    })    
  }
}