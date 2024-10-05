import { inject, injectable } from "tsyringe"
import type { ICustomerApiService } from "@/modules/customer/services/ICustomerApiService"
import { CommonCustomerContact } from "@/core/contracts/customer/CommonCustomerContact"
import { CommonCustomerContactDTO } from "@/core/dtos/customer/CommonCustomerContactDTO"

export interface ICommonCustomerContactService {
  getCustomerContacts(id: string): Promise<CommonCustomerContactDTO[]>
  getCustomerContact(customerId: string, contactId: number): Promise<CommonCustomerContactDTO>
  createCustomerContact(id: string, data: CommonCustomerContactDTO): Promise<void>
  updateCustomerContact(customerId: string, contactId: number, data: CommonCustomerContactDTO): Promise<void>
  deleteCustomerContact(customerId: string, contactId: number): Promise<void>
  setCustomerContact(customerId: string, contactId: number, data: boolean): Promise<void>
}

@injectable()
export class CommonCustomerContactService implements ICommonCustomerContactService {

  private _customerApiService: ICustomerApiService

  constructor(@inject('ICustomerApiService') customerApiService: ICustomerApiService) {
    this._customerApiService = customerApiService
  }

  async getCustomerContacts(customerId: string): Promise<CommonCustomerContactDTO[]> {
    // const contactsUrl = `/Customers/${customerId}/contacts`
    const contactsUrl = `http://localhost:4000/contacts`
    const response = await this._customerApiService.get<CommonCustomerContact[]>(contactsUrl)
    const data = response.data

    return data.map((item) => {
      const contacts = new CommonCustomerContactDTO()
      contacts.id = item.id
      contacts.firstName = item.firstName
      contacts.lastName = item.lastName
      contacts.email = item.email
      contacts.phoneNumber = item.phoneNumber
      contacts.isMain = item.isMain
      return contacts
    })
  }

  async getCustomerContact(customerId: string, contactId: number): Promise<CommonCustomerContactDTO> {
    // const contactUrl = `/Customers/${customerId}/contacts/${contactId}`
    const contactUrl = `http://localhost:4000/contacts/${contactId}`
    const response = await this._customerApiService.get<CommonCustomerContact>(contactUrl)
    const data = response.data
    const contact = new CommonCustomerContactDTO

    if (data) {
      contact.id = data.id
      contact.firstName = data.firstName
      contact.lastName = data.lastName
      contact.email = data.email
      contact.phoneNumber = data.phoneNumber
      contact.isMain = data.isMain
    }
    return contact
  }

  async createCustomerContact(customerId: string, data: CommonCustomerContactDTO): Promise<void> {
    const contact = new CommonCustomerContact
    contact.firstName = contact.firstName
    contact.lastName = contact.lastName
    contact.email = contact.email
    contact.phoneNumber = contact.phoneNumber
    contact.isMain = contact.isMain

    // const contactUrl = `/Customers/${customerId}/contacts`
    const contactUrl = `http://localhost:4000/contacts`
    await this._customerApiService.post(contactUrl, data)
  }

  async updateCustomerContact(customerId: string, contactId: number, data: CommonCustomerContactDTO): Promise<void> {
    const contact = new CommonCustomerContact
    contact.firstName = data.firstName
    contact.lastName = data.lastName
    contact.email = data.email
    contact.phoneNumber = data.phoneNumber
    
    // const contactUrl = `/Customers/${customerId}/contacts/${contactId}`
    const contactUrl = `http://localhost:4000/contacts/${contactId}`
    await this._customerApiService.put(contactUrl, contact)
  }

  async deleteCustomerContact(customerId: string, contactId: number): Promise<void> {

    // const contactUrl = `/Customers/${customerId}/contacts/${contactId}`
    const contactUrl = `http://localhost:4000/contacts/${contactId}`
    await this._customerApiService.delete(contactUrl)
  }

  async setCustomerContact(customerId: string, contactId: number, data: boolean): Promise<void> {
    const contact = new CommonCustomerContact
    contact.isMain = data

    // const contactUrl = `/Customers/${customerId}/contacts/${contactId}`
    const contactUrl = `http://localhost:4000/contacts/${contactId}`
    await this._customerApiService.patch(contactUrl, contact)
  }
}