import { ModuleRolePermissionDTO } from '@/modules/subscription/api/dtos/ModuleRolePermissionDTO'
import type { ModuleRolePermission } from '@/modules/subscription/api/contracts/ModuleRolePermission'
import { ModuleRolePermissionEdit } from '@/modules/subscription/api/contracts/ModuleRolePermissionEdit'
import type { ModulePermission } from '@/modules/subscription/api/contracts/ModulePermission'
import { inject, injectable } from 'tsyringe'
import type { ISubscriptionApiService } from '@/modules/subscription/services/ISubscriptionApiService'

export interface IModuleRolePermissionService {
  getModuleRolePermissions (moduleKey: string, roleId: string): Promise<ModuleRolePermissionDTO[]>
  getModuleRolePermissionsForEdit (moduleKey: string, roleId: string): Promise<ModuleRolePermissionDTO[]>
  updateModuleRolePermissions(moduleKey: string, roleId: string, permissions: string[]): Promise<void>
}

@injectable()
export class ModuleRolePermissionService implements IModuleRolePermissionService {

  private _subscriptionApiService: ISubscriptionApiService

  constructor(@inject('ISubscriptionApiService') subscriptionApiService: ISubscriptionApiService) {
    this._subscriptionApiService = subscriptionApiService
  }

  async getModuleRolePermissions (moduleKey: string, roleId: string): Promise<ModuleRolePermissionDTO[]> {

    const rolePermissionsUrl = `/Modules/${moduleKey}/roles/${roleId}/permissions`
    const response = await this._subscriptionApiService.get<ModuleRolePermission[]>(rolePermissionsUrl)
    const data = response.data

    return data.map((item) => {
      const permissions = new ModuleRolePermissionDTO()
      permissions.key = item.key
      permissions.name = item.name
      permissions.description = item.description

      return permissions
    })
  }

  async getModuleRolePermissionsForEdit (moduleKey: string, roleId: string): Promise<ModuleRolePermissionDTO[]> {

    const permissionsUrl = `/Modules/${moduleKey}/permissions`
    const modulePermissions = await this._subscriptionApiService.get<ModulePermission[]>(permissionsUrl)
    const rolePermissionsUrl = `/Modules/${moduleKey}/roles/${roleId}/permissions`
    const moduleRolePermissions = await this._subscriptionApiService.get<ModuleRolePermission[]>(rolePermissionsUrl)
    const all = modulePermissions.data
    const active = moduleRolePermissions.data
    const result: ModuleRolePermissionDTO[] = []

    for (let i = 0; i < all.length; i++) {
      const one = new ModuleRolePermissionDTO()
      one.key = all[i].key
      one.name = all[i].name
      one.description = all[i].description
      one.isChecked = active.some(x => x.key == all[i].key)
      result.push(one)
    }
    return result
  }

  async updateModuleRolePermissions(moduleKey: string, roleId: string, permissions: string[]): Promise<void> {
    const contract = new ModuleRolePermissionEdit()
    contract.permissions = permissions

    const rolePermissionsUrl = `/Modules/${moduleKey}/roles/${roleId}/permissions`
    await this._subscriptionApiService.put(rolePermissionsUrl, contract)
  }
}
