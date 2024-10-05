import type { OrganizationSubscriptionDTO } from '@/modules/subscription/api/dtos/OrganizationSubscriptionDTO'
import { OrganizationSubscription } from '@/modules/subscription/api/contracts/OrganizationSubscription'
import { inject, injectable } from 'tsyringe'
import type { ISubscriptionApiService } from '@/modules/subscription/services/ISubscriptionApiService'

export interface IOrganizationSubscriptionService {
  getOrganizationSubscriptions(organizationId: string): Promise<OrganizationSubscriptionDTO[]>
}

@injectable()
export class OrganizationSubscriptionService implements IOrganizationSubscriptionService {
  private _subscriptionApiService: ISubscriptionApiService

  constructor(@inject('ISubscriptionApiService') subscriptionApiService: ISubscriptionApiService) {
    this._subscriptionApiService = subscriptionApiService
  }

  async getOrganizationSubscriptions(organizationId: string): Promise<OrganizationSubscriptionDTO[]> {

    const organizationSubscriptionsUrl = `/Organizations/${organizationId}/subscriptions`
    const response = await this._subscriptionApiService.get<OrganizationSubscription[]>(organizationSubscriptionsUrl)

    return response.data.map((subscription) => {
      const subscriptions = new OrganizationSubscription()
      subscriptions.id = subscription.id
      subscriptions.planId = subscription.planId
      subscriptions.planName = subscription.planName
      subscriptions.created = subscription.created
      subscriptions.startDate = subscription.startDate
      subscriptions.endDate = subscription.endDate
      subscriptions.nextPaymentDate = subscription.nextPaymentDate
      return subscriptions
    })
  }
}
