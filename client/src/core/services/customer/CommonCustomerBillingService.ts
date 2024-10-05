
import { inject, injectable } from "tsyringe"
import type { ICustomerApiService } from "@/modules/customer/services/ICustomerApiService"
import { CommonCustomerBilling } from "@/core/contracts/customer/CommonCustomerBilling"
import { CommonCustomerBillingDTO } from "@/core/dtos/customer/CommonCustomerBillingDTO"

export interface ICommonCustomerBillingService {
  getCustomerBillings(customerId: string): Promise<CommonCustomerBillingDTO[]>
  getCustomerBilling(customerId: string, billingId: number): Promise<CommonCustomerBillingDTO>
  createCustomerBilling(customerId: string, data: CommonCustomerBillingDTO): Promise<string>
  updateCustomerBilling(customerId: string, billingId: number, data: CommonCustomerBillingDTO): Promise<void>
  deleteCustomerBilling(customerId: string, billingId: number): Promise<void>
  setCustomerBilling(customerId: string, billingId: number, data: boolean): Promise<void>
}

@injectable()
export class CommonCustomerBillingService implements ICommonCustomerBillingService {

  private _customerApiService: ICustomerApiService

  constructor(@inject('ICustomerApiService') customerApiService: ICustomerApiService) {
    this._customerApiService = customerApiService
  }

  async getCustomerBillings(customerId: string): Promise<CommonCustomerBillingDTO[]> {
    // const url = `/Customers/${customerId}/invoice-datas`
    const url = `http://localhost:4000/invoiceDatas`
    const response = await this._customerApiService.get<CommonCustomerBilling[]>(url)
    const data = response.data

    return data.map((item) => {
      const billings = new CommonCustomerBillingDTO
      billings.id = item.id
      billings.companyName = item.companyName
      billings.firstName = item.firstName
      billings.lastName = item.lastName
      billings.street = item.street
      billings.houseNo = item.houseNo
      billings.flatNo = item.flatNo
      billings.postCode = item.postCode
      billings.city = item.city
      billings.country = item.country
      billings.accountNumber = item.accountNumber
      billings.isMain = item.isMain
      return billings
    })
  }

  async getCustomerBilling(customerId: string, billingId: number): Promise<CommonCustomerBillingDTO> {
    // const url = `/Customers/${customerId}/invoice-datas/${billingId}`
    const url = `http://localhost:4000/invoiceDatas/${billingId}`
    const response = await this._customerApiService.get<CommonCustomerBilling>(url)
    const data = response.data
    const billing = new CommonCustomerBillingDTO

    if (data) {
      billing.id = data.id
      billing.companyName = data.companyName
      billing.firstName = data.firstName
      billing.lastName = data.lastName
      billing.street = data.street
      billing.houseNo = data.houseNo
      billing.flatNo = data.flatNo
      billing.postCode = data.postCode
      billing.city = data.city
      billing.country = data.country
      billing.accountNumber = data.accountNumber
      billing.isMain = data.isMain
    }
    return billing
  }

  async createCustomerBilling(customerId: string, data: CommonCustomerBillingDTO): Promise<string> {
    const billing = new CommonCustomerBilling
    billing.companyName = data.companyName
    billing.firstName = data.firstName
    billing.lastName = data.lastName
    billing.street = data.street
    billing.houseNo = data.houseNo
    billing.flatNo = data.flatNo
    billing.postCode = data.postCode
    billing.city = data.city
    billing.country = data.country
    billing.accountNumber = data.accountNumber

    // const url = `/Customers/${customerId}/invoice-datas`
    const url = `http://localhost:4000/invoiceDatas`
    const response = await this._customerApiService.post(url, billing)
    return response.headers.location
  }

  async updateCustomerBilling(customerId: string, billingId: number, data: CommonCustomerBillingDTO): Promise<void> {
    const billing = new CommonCustomerBilling
    billing.companyName = data.companyName
    billing.firstName = data.firstName
    billing.lastName = data.lastName
    billing.street = data.street
    billing.houseNo = data.houseNo
    billing.flatNo = data.flatNo
    billing.postCode = data.postCode
    billing.city = data.city
    billing.country = data.country
    billing.accountNumber = data.accountNumber

    // const url = `/Customers/${customerId}/invoice-datas/${billingId}`
    const url = `http://localhost:4000/invoiceDatas/${billingId}`
    await this._customerApiService.put(url, billing)
  }

  async deleteCustomerBilling(customerId: string, billingId: number): Promise<void> {
    // const url = `/Customers/${customerId}/invoice-datas/${billingId}`
    const url = `http://localhost:4000/invoiceDatas/${billingId}`
    await this._customerApiService.delete(url)
  }

  async setCustomerBilling(customerId: string, billingId: number, data: boolean): Promise<void> {
    const billing = new CommonCustomerBilling
    billing.isMain = data

    // const url = `/Customers/${customerId}/invoice-datas/${billingId}`
    const url = `http://localhost:4000/invoiceDatas/${billingId}`
    await this._customerApiService.patch(url, billing)
  }
}