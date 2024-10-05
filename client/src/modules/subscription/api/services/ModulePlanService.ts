import { ModulePlanDTO } from '@/modules/subscription/api/dtos/ModulePlanDTO'
import { ModulePlan } from '@/modules/subscription/api/contracts/ModulePlan'
import { inject, injectable } from 'tsyringe'
import type { ISubscriptionApiService } from '@/modules/subscription/services/ISubscriptionApiService'

export interface IModulePlanService {
  getModulePlans(moduleKey: string): Promise<ModulePlanDTO[]>
  getModulePlan(moduleKey: string, planId: string): Promise<ModulePlanDTO>
  createModulePlan(moduleKey: string, plan: ModulePlanDTO): Promise<string>
  updateModulePlan(moduleKey: string, planId: string, plan: ModulePlanDTO): Promise<void>
  deleteModulePlan(moduleKey: string, planId: string): Promise<void>
}

@injectable()
export class ModulePlanService implements IModulePlanService {

  private _subscriptionApiService: ISubscriptionApiService

  constructor(@inject('ISubscriptionApiService') subscriptionApiService: ISubscriptionApiService) {
    this._subscriptionApiService = subscriptionApiService
  }

  async getModulePlans(moduleKey: string): Promise<ModulePlanDTO[]> {

    const plansUrl = `/Modules/${moduleKey}/subscription-plans`
    const response = await this._subscriptionApiService.get<ModulePlan[]>(plansUrl)
    const data = response.data

    return data.map((plan) => {
      const plans = new ModulePlanDTO()
      plans.id = plan.id
      plans.name = plan.name
      plans.description = plan.description
      plans.price = plan.price
      return plans
    })
  }

  async getModulePlan(moduleKey: string, planId: string): Promise<ModulePlanDTO> {

    const planUrl = `/Modules/${moduleKey}/subscription-plans/${planId}`
    const response = await this._subscriptionApiService.get<ModulePlan>(planUrl)
    const data = response.data
    const plan = new ModulePlan()

    if (data) {
      plan.id = data.id
      plan.name = data.name
      plan.description = data.description
      plan.price = data.price
    }
    return plan
  }

  async createModulePlan(moduleKey: string, plan: ModulePlanDTO): Promise<string> {
    const contract = new ModulePlan()
    contract.name = plan.name
    contract.description = plan.description
    contract.price = plan.price

    const planUrl = `/Modules/${moduleKey}/subscription-plans`
    const response = await this._subscriptionApiService.post(planUrl, contract)
    const createdPlan = await this._subscriptionApiService.get<ModulePlan>(response.headers.location)

    return createdPlan.data.id
  }

  async updateModulePlan(moduleKey: string, planId: string, plan: ModulePlanDTO): Promise<void> {

    const contract = new ModulePlan()
    contract.name = plan.name
    contract.description = plan.description
    contract.price = plan.price

    const planUrl = `/Modules/${moduleKey}/subscription-plans/${planId}`
    await this._subscriptionApiService.put(planUrl, contract)
  }

  async deleteModulePlan(moduleKey: string, planId: string): Promise<void> {

    const planUrl = `/Modules/${moduleKey}/subscription-plans/${planId}`
    await this._subscriptionApiService.delete(planUrl)
  }
}
