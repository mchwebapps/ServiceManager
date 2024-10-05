import type { UserAccessDTO } from '@/modules/subscription/api/dtos/UserAccessDTO'
import { UserModuleAccessDTO } from '@/modules/subscription/api/dtos/UserModuleAccessDTO'
import type { Module } from '@/modules/subscription/api/contracts/Module'
import type { ModuleRole } from '@/modules/subscription/api/contracts/ModuleRole'
import { ModuleRoleDTO } from '@/modules/subscription/api/dtos/ModuleRoleDTO'
import { inject, injectable } from 'tsyringe'
import type { ISubscriptionApiService } from '@/modules/subscription/services/ISubscriptionApiService'

export interface IUserAccessService {
  getModuleAccess(userId: string): Promise<UserModuleAccessDTO[]>
}

@injectable()
export class UserAccessService implements IUserAccessService {

  private _subscriptionApiService: ISubscriptionApiService

  constructor(@inject('ISubscriptionApiService') subscriptionApiService: ISubscriptionApiService) {
    this._subscriptionApiService = subscriptionApiService
  }

  async getModuleAccess(userId: string): Promise<UserModuleAccessDTO[]> {

    const userAccessUrl = `/Users/${userId}/access`
    const modulesUrl = '/Modules?moduleType=ORGANIZATION_ROLE'
    const userAccess = await this._subscriptionApiService.get<UserAccessDTO[]>(userAccessUrl)
    const modules = await this._subscriptionApiService.get<Module[]>(modulesUrl)
    const userAccessData = userAccess.data ?? []
    const modulesData = modules.data

    const result = Array<UserModuleAccessDTO>() as UserModuleAccessDTO[]

    for (const module of modulesData) {
      const dto = new UserModuleAccessDTO()
      dto.moduleKey = module.key
      dto.moduleName = module.name

      const userModuleAccess = userAccessData.find(x => x.moduleKey == module.key)
      if (userModuleAccess) {
        dto.activeRoleId = userModuleAccess.roleId
        dto.hasUserAccess= userModuleAccess.hasUserAccess
      }
      const rolesUrl = `/Modules/${module.key}/roles`
      const roles = await this._subscriptionApiService.get<ModuleRole[]>(rolesUrl)
      const rolesData = roles.data

      dto.roles = rolesData.map(r => {
        const role = new ModuleRoleDTO()

        role.id = r.id
        role.name = r.name
        role.description = r.description
        role.organizationId = r.organizationId

        return role
      })
      result.push(dto)
    }
    return result
  }
}
