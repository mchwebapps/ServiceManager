import { OrganizationUserDTO } from '@/modules/subscription/api/dtos/OrganizationUserDTO'
import { OrganizationUser } from '@/modules/subscription/api/contracts/OrganizationUser'
import { inject, injectable } from 'tsyringe'
import type { ISubscriptionApiService } from '@/modules/subscription/services/ISubscriptionApiService'

export interface IOrganizationUserService {
  getOrganizationUsers(organizationId: string): Promise<OrganizationUserDTO[]>
  getOrganizationUser(userId: string): Promise<OrganizationUserDTO>
  createOrganizationUser(organizationId: string, organizationUser: OrganizationUserDTO): Promise<string>
  deleteOrganizationUser(userId: string): Promise<void>
}

@injectable()
export class OrganizationUserService implements IOrganizationUserService {

  private _subscriptionApiService: ISubscriptionApiService

  constructor(@inject('ISubscriptionApiService') subscriptionApiService: ISubscriptionApiService) {
    this._subscriptionApiService = subscriptionApiService
  }

  async getOrganizationUsers(organizationId: string): Promise<OrganizationUserDTO[]> {

    const organizationUsersUrl = `/Organizations/${organizationId}/users`
    const response = await this._subscriptionApiService.get<OrganizationUser[]>(organizationUsersUrl)
    const data = response.data

    return data.map((item) => {
      const users = new OrganizationUserDTO()
      users.id = item.id
      users.username = item.username
      users.firstName = item.firstName
      users.lastName = item.lastName
      users.email = item.email
      users.phone = item.phone
      return users
    })
  }

  async getOrganizationUser(userId: string): Promise<OrganizationUserDTO> {

    const organizationUserUrl = `/Users/${userId}`
    const response = await this._subscriptionApiService.get<OrganizationUser>(organizationUserUrl)
    const data = response.data
    const user = new OrganizationUserDTO()

    if (data != null) {
      user.id = data.id
      user.username = data.username
      user.firstName = data.firstName
      user.lastName = data.lastName
      user.email = data.email
      user.phone = data.phone
    }
    return user
  }

  async createOrganizationUser(organizationId: string, organizationUser: OrganizationUserDTO): Promise<string> {

    const user = new OrganizationUser()
    user.username = organizationUser.username
    user.firstName = organizationUser.firstName
    user.lastName = organizationUser.lastName
    user.email = organizationUser.email
    user.phone = organizationUser.phone
    user.organizationId = organizationId

    const organizationUserUrl = '/Users'
    const response = await this._subscriptionApiService.post(organizationUserUrl, user)
    const createdUser = await this._subscriptionApiService.get<OrganizationUser>(response.headers.location)

    return createdUser.data.id
  }

  async deleteOrganizationUser(userId: string): Promise<void> {

    const organizationUserUrl = `/Users/${userId}`
    await this._subscriptionApiService.delete(organizationUserUrl)
  }
}
