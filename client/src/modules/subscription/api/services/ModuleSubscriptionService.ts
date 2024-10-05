import type { ModuleSubscription } from '@/modules/subscription/api/contracts/ModuleSubscription'
import { ModuleSubscriptionDTO } from '@/modules/subscription/api/dtos/ModuleSubscriptionDTO'
import { inject, injectable } from 'tsyringe'
import type { ISubscriptionApiService } from '@/modules/subscription/services/ISubscriptionApiService'

export interface IModuleSubscriptionService {
  // getSubscriptions(moduleId: number): Promise<UserSubscriptionDTO[]>
  getModuleSubscriptions(moduleKey: string): Promise<ModuleSubscriptionDTO[]>
}

@injectable()
export class ModuleSubscriptionService implements IModuleSubscriptionService {

  private _subscriptionApiService: ISubscriptionApiService

  constructor(@inject('ISubscriptionApiService') subscriptionApiService: ISubscriptionApiService) {
    this._subscriptionApiService = subscriptionApiService
  }

  async getModuleSubscriptions(moduleKey: string): Promise<ModuleSubscriptionDTO[]> {

    const moduleSubscriptionsUrl = `Modules/${moduleKey}/subscriptions`
    const response = await this._subscriptionApiService.get<ModuleSubscription[]>(moduleSubscriptionsUrl)
    const data = response.data

    return data.map((subscription) => {
      const subscriptions = new ModuleSubscriptionDTO()
      subscriptions.id = subscription.id
      subscriptions.planId = subscription.planId
      subscriptions.planName = subscription.planName
      subscriptions.created = subscription.created
      subscriptions.startDate = subscription.startDate
      subscriptions.endDate = subscription.endDate
      subscriptions.nextPaymentDate = subscription.nextPaymentDate
      subscriptions.organizationName = subscription.organizationName
      subscriptions.organizationOwnerEmail = subscription.organizationOwnerEmail
      subscriptions.organizationId = subscription.organizationId
      return subscriptions
    })
  }


  // getSubscriptions(moduleId: number): Promise<UserSubscriptionDTO[]> {

  //   const subscriptionsData = userSubscriptions.filter((cd) => cd.moduleId == moduleId) as UserSubscription[]
  
  //   return subscriptionsData.map(item => {
  //     const tmp = new UserSubscriptionDTO()
  //     tmp.userId = item.userId
  //     tmp.moduleId = item.moduleId
  //     tmp.subscriptionType = item.subscriptionType
  //     tmp.startDate = item.startDate
  //     tmp.endDate = item.endDate
  //     tmp.price = item.price
  //     tmp.currency = item.currency
  //     tmp.billing = item.billing
  //     tmp.subscriptionStatus = item.subscriptionStatus
  
  //     return tmp
  //   })
  // }
}
