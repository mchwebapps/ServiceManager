import type { ModulePermission } from '@/modules/subscription/api/contracts/ModulePermission'
import { ModulePlanPermissionDTO } from '@/modules/subscription/api/dtos/ModulePlanPermissionDTO'
import type { ModulePlanPermission } from '@/modules/subscription/api/contracts/ModulePlanPermission'
import { ModulePlanPermissionEdit } from '@/modules/subscription/api/contracts/ModulePlanPermissionEdit'
import { inject, injectable } from 'tsyringe'
import type { ISubscriptionApiService } from '@/modules/subscription/services/ISubscriptionApiService'

export interface IModulePlanPermissionService {
  getModulePlanPermissions (moduleKey: string, planId: string): Promise<ModulePlanPermissionDTO[]>
  getModulePlanPermissionsForEdit (moduleKey: string, planId: string): Promise<ModulePlanPermissionDTO[]>
  updateModulePlanPermissions(moduleKey: string, planId: string, permissions: string[]): Promise<void>
}

@injectable()
export class ModulePlanPermissionService implements IModulePlanPermissionService {

  private _subscriptionApiService: ISubscriptionApiService

  constructor(@inject('ISubscriptionApiService') subscriptionApiService: ISubscriptionApiService) {
    this._subscriptionApiService = subscriptionApiService
  }

  async getModulePlanPermissions (moduleKey: string, planId: string): Promise<ModulePlanPermissionDTO[]> {

    const planPermissionsUrl = `/Modules/${moduleKey}/subscription-plans/${planId}/permissions`
    const response = await this._subscriptionApiService.get<ModulePlanPermission[]>(planPermissionsUrl)
    const data = response.data

    return data.map((permission) => {
      const permissions = new ModulePlanPermissionDTO()
      permissions.key = permission.key
      permissions.name = permission.name
      permissions.description = permission.description
      return permissions
    })
  }

  async getModulePlanPermissionsForEdit (moduleKey: string, planId: string): Promise<ModulePlanPermissionDTO[]> {

    const permissionsUrl = `/Modules/${moduleKey}/permissions`
    const modulePermissions = await this._subscriptionApiService.get<ModulePermission[]>(permissionsUrl)
    const planPermissionsUrl = `/Modules/${moduleKey}/subscription-plans/${planId}/permissions`
    const modulePlanPermissions = await this._subscriptionApiService.get<ModulePlanPermission[]>(planPermissionsUrl)
    const all = modulePermissions.data
    const active = modulePlanPermissions.data
    const result: ModulePlanPermissionDTO[] = []

    for (let i = 0; i < all.length; i++) {
      const one = new ModulePlanPermissionDTO()
      one.key = all[i].key
      one.name = all[i].name
      one.description = all[i].description
      one.isChecked = active.some(x => x.key == all[i].key)
      result.push(one)
    }
    return result
  }

  async updateModulePlanPermissions(moduleKey: string, planId: string, permissions: string[]): Promise<void> {

    const planPermissionsUrl = `/Modules/${moduleKey}/subscription-plans/${planId}/permissions`
    const contract = new ModulePlanPermissionEdit()
    contract.permissions = permissions

    await this._subscriptionApiService.put(planPermissionsUrl, contract)
  }
}
