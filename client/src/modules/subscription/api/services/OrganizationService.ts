import type { Organization } from '@/modules/subscription/api/contracts/Organization'
import type { OrganizationSummary } from '@/modules/subscription/api/contracts/OrganizationSummary'
import { OrganizationDTO } from '@/modules/subscription/api/dtos/OrganizationDTO'
import { OrganizationSummaryDTO } from '@/modules/subscription/api/dtos/OrganizationSummaryDTO'
import { inject, injectable } from 'tsyringe'
import type { ISubscriptionApiService } from '@/modules/subscription/services/ISubscriptionApiService'

export interface IOrganizationService {
  getOrganizations(): Promise<OrganizationSummaryDTO[]>
  getOrganization(id: string): Promise<OrganizationDTO>
}

@injectable()
export class OrganizationService implements IOrganizationService {

  private _subscriptionApiService: ISubscriptionApiService

  constructor(@inject('ISubscriptionApiService') subscriptionApiService: ISubscriptionApiService) {
    this._subscriptionApiService = subscriptionApiService
  }

  async getOrganizations(): Promise<OrganizationSummaryDTO[]> {

    const organizationsUrl = '/Organizations/summary'
    const response = await this._subscriptionApiService.get<OrganizationSummary[]>(organizationsUrl)
    const data = response.data

    return data.map((item) => {
      const organizations = new OrganizationSummaryDTO()
      organizations.id = item.id
      organizations.name = item.name
      organizations.userCount = item.userCount
      organizations.hasActiveSubscription = item.hasActiveSubscription
      organizations.ownerUserEmail = item.ownerUserEmail
      organizations.ownerUserId = item.ownerUserId
      return organizations
    })
  }
  async getOrganization(id: string): Promise<OrganizationDTO> {

    const organizationUrl = `/Organizations/${id}`
    const response = await this._subscriptionApiService.get<Organization>(organizationUrl)
    const data = response.data
    const organization = new OrganizationDTO()

    if (data != null) {
      organization.id = data.id
      organization.ownerUserId = data.ownerUserId
      organization.name = data.name
      organization.street = data.street
      organization.city = data.city
      organization.houseNo = data.houseNo
      organization.flatNo = data.flatNo
      organization.postCode = data.postCode
      organization.voivodeship = data.voivodeship
      organization.country = data.country
      organization.taxNumber = data.taxNumber
      organization.accountType = data.accountType
      organization.ownerAccountUsername = data.ownerAccountUsername
      organization.ownerAccountEmail = data.ownerAccountEmail
    }
    return organization
  }
}
