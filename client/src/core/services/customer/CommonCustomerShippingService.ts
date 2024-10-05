import { inject, injectable } from "tsyringe"
import type { ICustomerApiService } from "@/modules/customer/services/ICustomerApiService"
import { CommonCustomerShipping } from "@/core/contracts/customer/CommonCustomerShipping"
import { CommonCustomerShippingDTO } from "@/core/dtos/customer/CommonCustomerShippingDTO"

export interface ICommonCustomerShippingService {
  getCustomerShippings(customerId: string): Promise<CommonCustomerShippingDTO[]>
  getCustomerShipping(customerId: string, shippingId: number): Promise<CommonCustomerShippingDTO>
  createCustomerShipping(customerId: string, shipping: CommonCustomerShippingDTO): Promise<void>
  updateCustomerShipping(customerId: string, shippingId: number, data: CommonCustomerShippingDTO): Promise<void>
  deleteCustomerShipping(customerId: string, shippingId: number): Promise<void>
  setCustomerShipping(customerId: string, shippingId: number, data: boolean): Promise<void>
}

@injectable()
export class CommonCustomerShippingService implements ICommonCustomerShippingService {

  private _customerApiService: ICustomerApiService

  constructor(@inject('ICustomerApiService') customerApiService: ICustomerApiService) {
    this._customerApiService = customerApiService
  }

  async getCustomerShippings(customerId: string): Promise<CommonCustomerShippingDTO[]> {
    // const shippingsUrl = `/Customers/${customerId}/delivery-datas`
    const shippingsUrl = `http://localhost:4000/deliveryDatas`
    const response = await this._customerApiService.get<CommonCustomerShipping[]>(shippingsUrl)
    const data = response.data

    return data.map((item) => {
      const shippings = new CommonCustomerShippingDTO()
      shippings.id = item.id
      shippings.firstName = item.firstName
      shippings.lastName = item.lastName
      shippings.companyName = item.companyName
      shippings.email = item.email
      shippings.phoneNumber = item.phoneNumber
      shippings.street = item.street
      shippings.houseNo = item.houseNo
      shippings.flatNo = item.flatNo
      shippings.postCode = item.postCode
      shippings.city = item.city
      shippings.country = item.country
      shippings.isMain = item.isMain
      return shippings
    })
  }

  async getCustomerShipping(customerId: string, shippingId: number): Promise<CommonCustomerShippingDTO> {
    // const shippingUrl = `/Customers/${customerId}/delivery-datas/${shippingId}`
    const shippingUrl = `http://localhost:4000/deliveryDatas/${shippingId}`
    const response = await this._customerApiService.get<CommonCustomerShipping>(shippingUrl)
    const data = response.data
    const shipping = new CommonCustomerShippingDTO

    if (data) {
      shipping.id = data.id
      shipping.firstName = data.firstName
      shipping.lastName = data.lastName
      shipping.companyName = data.companyName
      shipping.email = data.email
      shipping.phoneNumber = data.phoneNumber
      shipping.street = data.street
      shipping.houseNo = data.houseNo
      shipping.flatNo = data.flatNo
      shipping.postCode = data.postCode
      shipping.city = data.city
      shipping.country = data.country
      shipping.isMain = data.isMain
    }
    return shipping
  }

  async createCustomerShipping(customerId: string, data: CommonCustomerShippingDTO): Promise<void> {
    const shipping = new CommonCustomerShipping
    shipping.firstName = data.firstName
    shipping.lastName = data.lastName
    shipping.companyName = data.companyName
    shipping.email = data.email
    shipping.phoneNumber = data.phoneNumber
    shipping.street = data.street
    shipping.houseNo = data.houseNo
    shipping.flatNo = data.flatNo
    shipping.postCode = data.postCode
    shipping.city = data.city
    shipping.country = data.country

    // const shippingUrl = `/Customers/${customerId}/delivery-datas`
    const shippingUrl = `http://localhost:4000/deliveryDatas`
    await this._customerApiService.post(shippingUrl, data)
  }

  async updateCustomerShipping(customerId: string, shippingId: number, data: CommonCustomerShippingDTO): Promise<void> {
    const shipping = new CommonCustomerShipping
    shipping.firstName = data.firstName
    shipping.lastName = data.lastName
    shipping.companyName = data.companyName
    shipping.email = data.email
    shipping.phoneNumber = data.phoneNumber
    shipping.street = data.street
    shipping.houseNo = data.houseNo
    shipping.flatNo = data.flatNo
    shipping.postCode = data.postCode
    shipping.city = data.city
    shipping.country = data.country
    
    // const shippingUrl = `/Customers/${customerId}/delivery-datas/${shippingId}`
    const shippingUrl = `http://localhost:4000/deliveryDatas/${shippingId}`
    await this._customerApiService.put(shippingUrl, shipping)
  }

  async deleteCustomerShipping(customerId: string, shippingId: number): Promise<void> {

    // const shippingUrl = `/Customers/${customerId}/delivery-datas/${shippingId}`
    const shippingUrl = `http://localhost:4000/deliveryDatas/${shippingId}`
    await this._customerApiService.delete(shippingUrl)
  }

  async setCustomerShipping(customerId: string, shippingId: number, data: boolean): Promise<void> {
    const shipping = new CommonCustomerShipping
    shipping.isMain = data

    // const shippingUrl = `/Customers/${customerId}/delivery-datas/${shippingId}`
    const shippingUrl = `http://localhost:4000/deliveryDatas/${shippingId}`
    await this._customerApiService.patch(shippingUrl, shipping)
  }
}