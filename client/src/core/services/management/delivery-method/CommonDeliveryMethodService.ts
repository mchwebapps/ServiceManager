import { inject, injectable } from "tsyringe"
import type { IServiceApiService } from "@/modules/service/services/IServiceApiService"
import type { CommonDeliveryMethod } from "@/core/contracts/management/delivery-method/CommonDeliveryMethod"
import { DeliveryMethodDTO } from "@/core/dtos/management/delivery-method/DeliveryMethodDTO"

export interface ICommonDeliveryMethodService {
  getDeliveryMethods(): Promise<DeliveryMethodDTO[]>
}

@injectable()
export class CommonDeliveryMethodService implements ICommonDeliveryMethodService {

  private _serviceApiService: IServiceApiService

  constructor(@inject('IServiceApiService') serviceApiService: IServiceApiService) {
    this._serviceApiService = serviceApiService
  }

  async getDeliveryMethods(): Promise<DeliveryMethodDTO[]> {
    const url = 'http://localhost:4000/deliveryMethods'
    const response = await this._serviceApiService.get<CommonDeliveryMethod[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new DeliveryMethodDTO
      result.id = item.id
      result.name = item.name
      return result
    })    
  }
}