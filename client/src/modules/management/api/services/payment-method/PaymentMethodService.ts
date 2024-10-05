import { inject, injectable } from "tsyringe"
import type { IManagementApiService } from "@/modules/management/services/IManagementApiService"
import { PaymentMethod } from "@/modules/management/api/contracts/payment-method/PaymentMethod"
import { PaymentMethodDTO } from "@/modules/management/api/dtos/payment-method/PaymentMethodDTO"

export interface IPaymentMethodService {
  getPaymentMethods(): Promise<PaymentMethodDTO[]>
  getPaymentMethod(paymentId: number): Promise<PaymentMethodDTO>
  createPaymentMethod(data: PaymentMethodDTO): Promise<void>
  updatePaymentMethod(paymentId: number, data: PaymentMethodDTO): Promise<void>
  deletePaymentMethod(paymentId: number): Promise<void>
}

@injectable()
export class PaymentMethodService implements IPaymentMethodService {

  private _managementApiService: IManagementApiService

  constructor(@inject('IManagementApiService') managementApiService: IManagementApiService) {
    this._managementApiService = managementApiService
  }

  async getPaymentMethods(): Promise<PaymentMethodDTO[]> {
    const url = 'http://localhost:4000/paymentMethods'
    const response = await this._managementApiService.get<PaymentMethod[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new PaymentMethodDTO
      result.id = item.id
      result.name = item.name
      return result
    })    
  }

  async getPaymentMethod(paymentId: number): Promise<PaymentMethodDTO> {
    const url = `http://localhost:4000/paymentMethods/${paymentId}`
    const response = await this._managementApiService.get<PaymentMethod>(url)
    const data = response.data
    const result = new PaymentMethodDTO
    result.id = data.id
    result.name = data.name
    return result
  }

  async createPaymentMethod(data: PaymentMethodDTO): Promise<void> {
    const item = new PaymentMethod
    item.id = data.id
    item.name = data.name

    const url = `http://localhost:4000/paymentMethods`
    await this._managementApiService.post(url, item)
  }

  async updatePaymentMethod(paymentId: number, data: PaymentMethodDTO): Promise<void> {
    const item = new PaymentMethod
    item.name = data.name

    const url = `http://localhost:4000/paymentMethods/${paymentId}`
    await this._managementApiService.put(url, item)
  }

  async deletePaymentMethod(paymentId: number): Promise<void> {
    const url = `http://localhost:4000/paymentMethods/${paymentId}`
    await this._managementApiService.delete(url)
  }
}