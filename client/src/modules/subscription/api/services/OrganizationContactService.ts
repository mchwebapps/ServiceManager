import type { AxiosResponse } from 'axios'
import { OrganizationContactDTO } from '@/modules/subscription/api/dtos/OrganizationContactDTO'
import { OrganizationContact } from '@/modules/subscription/api/contracts/OrganizationContact'
import { inject, injectable } from 'tsyringe'
import type { ISubscriptionApiService } from '@/modules/subscription/services/ISubscriptionApiService'

export interface IOrganizationContactService {
  getContacts(organizationId: string): Promise<OrganizationContactDTO[]>
  createContact(organizationId: string, contact: OrganizationContactDTO): Promise<void>
  // editContacts(organizationId: string, contacts: OrganizationContactDTO[]): Promise<void>
  updateContact(organizationId: string, contact: OrganizationContactDTO): Promise<void>
  deleteContact(organizationId: string, contactId: number): Promise<void>
}

@injectable()
export class OrganizationContactService implements IOrganizationContactService {

  private _subscriptionApiService: ISubscriptionApiService

  constructor(@inject('ISubscriptionApiService') subscriptionApiService: ISubscriptionApiService) {
    this._subscriptionApiService = subscriptionApiService
  }

  async getContacts(organizationId: string): Promise<OrganizationContactDTO[]> {

    const contactsUrl = `/Organizations/${organizationId}/contacts`
    const response = await this._subscriptionApiService.get<OrganizationContact[]>(contactsUrl)
    const obj = response.data as OrganizationContact[]

    return obj.map((item) => {
      const tmp = new OrganizationContactDTO()
      tmp.id = item.id
      tmp.firstName = item.firstName
      tmp.lastName = item.lastName
      tmp.email = item.email
      tmp.phone = item.phone
      return tmp
    })
  }

  async createContact(organizationId: string, contact: OrganizationContactDTO): Promise<void> {
  
    const contract = new OrganizationContact()
    contract.firstName = contact.firstName ?? ''
    contract.lastName = contact.lastName ?? ''
    contract.phone = contact.phone ?? ''
    contract.email = contact.email ?? ''

    const contactUrl = `/Organizations/${organizationId}/contacts`
    await this._subscriptionApiService.post(contactUrl, contract)
  }

  async updateContact(organizationId: string, contact: OrganizationContactDTO): Promise<void> {

    const contract = new OrganizationContact()
    contract.id = contact.id
    contract.firstName = contact.firstName ?? ''
    contract.lastName = contact.lastName ?? ''
    contract.phone = contact.phone
    contract.email = contact.email

    const contactsUrl = `/Organizations/${organizationId}/contacts/${contract.id}`
    await this._subscriptionApiService.put(contactsUrl, contract)
  }

  // async editContacts(organizationId: string,contacts: OrganizationContactDTO[]): Promise<void> {

  //   const requests: Promise<AxiosResponse<any>>[] = []

  //   for (let c = 0; c < contacts.length; c++) {
  //     const contract = new OrganizationContact()
  //     contract.id = contacts[c].id
  //     contract.firstName = contacts[c].firstName
  //     contract.lastName = contacts[c].lastName
  //     contract.phone = contacts[c].phone
  //     contract.email = contacts[c].email

  //     const contactsUrl = `/Organizations/${organizationId}/contacts/${contract.id}`
  //     requests.push(this._subscriptionApiService.put(contactsUrl, contract)
  //     )
  //   }
  //   await Promise.all(requests)
  // }

  async deleteContact(organizationId: string, contactId: number): Promise<void> {

    const contactUrl = `/Organizations/${organizationId}/contacts/${contactId}`
    await this._subscriptionApiService.delete(contactUrl)
  }
}
