import { inject, injectable } from "tsyringe"
import type { IServiceApiService } from "@/modules/service/services/IServiceApiService"
import type { CommonPaymentMethod } from "@/core/contracts/management/payment-method/CommonPaymentMethod"
import { PaymentMethodDTO } from "@/core/dtos/management/payment-method/PaymentMethodDTO"

export interface ICommonPaymentMethodService {
  getPaymentMethods(): Promise<PaymentMethodDTO[]>
}

@injectable()
export class CommonPaymentMethodService implements ICommonPaymentMethodService {

  private _serviceApiService: IServiceApiService

  constructor(@inject('IServiceApiService') serviceApiService: IServiceApiService) {
    this._serviceApiService = serviceApiService
  }

  async getPaymentMethods(): Promise<PaymentMethodDTO[]> {
    const url = 'http://localhost:4000/paymentMethods'
    const response = await this._serviceApiService.get<CommonPaymentMethod[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new PaymentMethodDTO
      result.id = item.id
      result.name = item.name
      return result
    })    
  }
}