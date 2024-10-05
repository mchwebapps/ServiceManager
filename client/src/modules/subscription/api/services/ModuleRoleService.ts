import { ModuleRoleDTO } from '@/modules/subscription/api/dtos/ModuleRoleDTO'
import { ModuleRole } from '@/modules/subscription/api/contracts/ModuleRole'
import { inject, injectable } from 'tsyringe'
import type { ISubscriptionApiService } from '@/modules/subscription/services/ISubscriptionApiService'

export interface IModuleRoleService {
  getModuleRoles(moduleKey: string, organizationId?: string): Promise<ModuleRoleDTO[]>
  getModuleRole(moduleKey: string, roleId: string): Promise<ModuleRoleDTO>
  createModuleRole(moduleKey: string, role: ModuleRoleDTO, organizationId?: string): Promise<string>
  updateModuleRole(moduleKey: string, roleId: string, role: ModuleRoleDTO, organizationId?: string): Promise<void>
  deleteModuleRole(moduleKey: string, roleId: string): Promise<void>
}

@injectable()
export class ModuleRoleService implements IModuleRoleService {

  private _subscriptionApiService: ISubscriptionApiService

  constructor(@inject('ISubscriptionApiService') subscriptionApiService: ISubscriptionApiService) {
    this._subscriptionApiService = subscriptionApiService
  }

  async getModuleRoles(moduleKey: string, organizationId?: string): Promise<ModuleRoleDTO[]> {

    const rolesUrl = `/Modules/${moduleKey}/roles`
    const response = await this._subscriptionApiService.get<ModuleRole[]>(rolesUrl)
    const data = response.data

    return data.map((item) => {
      const roles = new ModuleRoleDTO()
      roles.id = item.id
      roles.name = item.name
      roles.description = item.description
      roles.organizationId = item.organizationId // organizationId
      return roles
    })
  }

  async getModuleRole(moduleKey: string, roleId: string): Promise<ModuleRoleDTO> {

    const roleUrl = `/Modules/${moduleKey}/roles/${roleId}`
    const response = await this._subscriptionApiService.get<ModuleRole>(roleUrl)
    const data = response.data
    const role = new ModuleRole()

    if (data) {
      role.id = data.id
      role.name = data.name
      role.description = data.description
      role.organizationId = data.organizationId
    }
    return role
  }

  async createModuleRole(moduleKey: string, role: ModuleRoleDTO, organizationId?: string): Promise<string> {

    const contract = new ModuleRole()
    contract.name = role.name
    contract.description = role.description
    contract.organizationId = organizationId as string

    const roleUrl = `/Modules/${moduleKey}/roles`
    const response = await this._subscriptionApiService.post(roleUrl, contract)
    const createdRole = await this._subscriptionApiService.get<ModuleRole>(response.headers.location)

    return createdRole.data.id
  }

  async updateModuleRole(moduleKey: string, roleId: string, role: ModuleRoleDTO, organizationId?: string): Promise<void> {

    const contract = new ModuleRole()
    contract.name = role.name
    contract.description = role.description
    contract.organizationId = organizationId as string

    const roleUrl = `/Modules/${moduleKey}/roles/${roleId}`
    await this._subscriptionApiService.put(roleUrl, contract)
  }

  async deleteModuleRole(moduleKey: string, roleId: string): Promise<void> {

    const roleUrl = `/Modules/${moduleKey}/roles/${roleId}`
    await this._subscriptionApiService.delete(roleUrl)
  }
}
