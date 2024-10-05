import { SubscriptionTypes } from '@/modules/subscription/api/enums/StoreEnums'

export class SubscriptionTypeHelper {
  static getSubscriptionTypeName(type: SubscriptionTypes) {
    switch (type) {
      case SubscriptionTypes.Basic:
        return 'Plan podstawowy'
      case SubscriptionTypes.Advance:
        return 'Plan rozszerzony'
      case SubscriptionTypes.Pro:
        return 'Plan pro'
      default:
        return ''
    }
  }
}
