import { inject, injectable } from "tsyringe"
import type { ICustomerApiService } from "@/modules/customer/services/ICustomerApiService"
import type { Customer } from "@/modules/customer/api/contracts/Customer"
import type { CustomerSearch } from "@/modules/customer/api/contracts/CustomerSearch"
import { CustomerCreate } from "@/modules/customer/api/contracts/CustomerCreate"
import { CustomerDTO } from "@/modules/customer/api/dtos/CustomerDTO"
import { CustomerSearchDTO } from "@/modules/customer/api/dtos/CustomerSearchDTO"
import type { CustomerCreateDTO } from "@/modules/customer/api/dtos/CustomerCreateDTO"
import type { CustomerSearchItemDTO } from "@/modules/customer/api/dtos/CustomerSearchItemDTO"
import { CommonCustomerSelectItemDTO } from "@/core/dtos/customer/CommonCustomerSelectItemDTO"

export interface ICommonCustomerService {
  getCustomers(): Promise<CustomerSearchDTO>
  getCustomersForSelectOptions(): Promise<CommonCustomerSelectItemDTO[]>
  getCustomer(customerId: string): Promise<CustomerDTO>
  createCustomer(data: CustomerCreateDTO): Promise<string>
  deleteCustomer(customerId: string): Promise<void>
}

@injectable()
export class CommonCustomerService implements ICommonCustomerService {

  private _customerApiService: ICustomerApiService

  constructor(@inject('ICustomerApiService') customerApiService: ICustomerApiService) {
    this._customerApiService = customerApiService
  }

  async getCustomers(): Promise<CustomerSearchDTO> {
    // const url = '/Customers'
    const url = 'http://localhost:4000/customers'
    const response = await this._customerApiService.get<CustomerSearch>(url)
    const data = response.data

    const searchResult = new CustomerSearchDTO
    
    if (data) {
      // searchResult.items = data.items.map((item) => {
      searchResult.items = data.items.map((item) => {
        let res: CustomerSearchItemDTO
        res = {
          id: item.id,
          name: item.name,
          taxNumber: item.taxNumber,
          email: item.email,
          phone: item.phone,
          customerType: item.customerType
        }
        console.log(data)
        return res
      })
      searchResult.pageNumber = data.pageNumber
      searchResult.totalPages = data.totalPages
      searchResult.totalCount = data.totalCount
    }
    return searchResult
  }

  async getCustomersForSelectOptions(): Promise<CommonCustomerSelectItemDTO[]> {
    // const url = '/Customers'
    const url = 'http://localhost:4000/customers'
    const response = await this._customerApiService.get<CustomerSearch>(url)
    const data = response.data
    const result = new Array<CommonCustomerSelectItemDTO>

    for (let customer of data.items) {
      const item = new CommonCustomerSelectItemDTO
      item.id = customer.id
      item.name = customer.name ?? ''
      result.push(item)
    }
    return result
  }

  async getCustomer(customerId: string): Promise<CustomerDTO> {
    // const url = `/Customers/${customerId}`
    const url = `http://localhost:4000/customers/${customerId}`
    const response = await this._customerApiService.get<Customer>(url)
    const data = response.data
    const customer = new CustomerDTO

    if (data) {
      customer.id = data.id
      customer.name = data.name
      customer.taxNumber = data.taxNumber
      customer.customerType = data.customerType
    }
    return customer
  }

  async createCustomer(data: CustomerCreateDTO): Promise<string> {
    const customer = new CustomerCreate
    customer.taxNumber = data.taxNumber
    customer.companyName = data.companyName
    customer.firstName = data.firstName
    customer.lastName = data.lastName
    customer.email = data.email
    customer.phoneNumber = data.phoneNumber
    customer.street = data.street
    customer.houseNo = data.houseNo
    customer.flatNo = data.flatNo
    customer.postCode = data.postCode
    customer.city = data.city
    customer.country = data.country
    customer.accountNumber = data.accountNumber

    // const url = '/Customers'
    const url = 'http://localhost:4000/customers'
    const response = await this._customerApiService.post(url, data)
    const createdCustomer = await this._customerApiService.get<Customer>(response.headers.location)

    return createdCustomer.data.id
  }

  async deleteCustomer(customerId: string): Promise<void> {
    // const url = `/Customers/${customerId}`
    const url = `http://localhost:4000/customers/${customerId}`
    await this._customerApiService.delete(url)
  }
}