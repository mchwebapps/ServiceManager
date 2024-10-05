import { ModuleDTO } from '@/modules/subscription/api/dtos/ModuleDTO'
import type { Module } from '@/modules/subscription/api/contracts/Module'
import { inject, injectable } from 'tsyringe'
import type { ISubscriptionApiService } from '@/modules/subscription/services/ISubscriptionApiService'

export interface IModuleService {
  getModules(type?: string): Promise<ModuleDTO[]>
  getModule(moduleKey: string): Promise<ModuleDTO>
}

@injectable()
export class ModuleService implements IModuleService {

  private _subscriptionApiService: ISubscriptionApiService

  constructor(@inject('ISubscriptionApiService') subscriptionApiService: ISubscriptionApiService) {
    this._subscriptionApiService = subscriptionApiService
  }

  async getModules(type?: string): Promise<ModuleDTO[]> {

    const modulesUrl = (type) ? `/Modules?moduleType=${type}` : '/Modules'
    const response = await this._subscriptionApiService.get<Module[]>(modulesUrl)
    const data = response.data

    return data.map((item) => {
      const modules = new ModuleDTO()
      modules.key = item.key
      modules.name = item.name
      return modules
    })
  }

  async getModule(moduleKey: string): Promise<ModuleDTO> {

    const moduleUrl = `/Modules/${moduleKey}`
    const response = await this._subscriptionApiService.get<Module>(moduleUrl)
    const data = response.data
    const module = new ModuleDTO

    if (data) {
      module.key = data.key
      module.name = data.name
    }
    return module
  }
}
