import { ModulePermissionDTO } from '@/modules/subscription/api/dtos/ModulePermissionDTO'
import type { ModulePermission } from '@/modules/subscription/api/contracts/ModulePermission'
import { inject, injectable } from 'tsyringe'
import type { ISubscriptionApiService } from '@/modules/subscription/services/ISubscriptionApiService'

export interface IModulePermissionService {
  getPermissionsByModuleKey(moduleKey: string): Promise<ModulePermissionDTO[]>
}

@injectable()
export class ModulePermissionService implements IModulePermissionService {

  private _subscriptionApiService: ISubscriptionApiService

  constructor(@inject('ISubscriptionApiService') subscriptionApiService: ISubscriptionApiService) {
    this._subscriptionApiService = subscriptionApiService
  }

  async getPermissionsByModuleKey(moduleKey: string): Promise<ModulePermissionDTO[]> {

    const permissionsUrl = `/Modules/${moduleKey}/permissions`
    const response = await this._subscriptionApiService.get<ModulePermission[]>(permissionsUrl)
    const data = response.data

    return data.map((item) => {
      const permissions = new ModulePermissionDTO()
      permissions.key = item.key
      permissions.name = item.name
      permissions.description = item.description
      return permissions
    })
  }
}
