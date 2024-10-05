import { Modules } from '@/modules/subscription/api/enums/StoreEnums'

export class ModuleHelper {
  static getModuleName(type: Modules) {
    switch (type) {
      case Modules.ServiceApp:
        return 'Serwis'
      case Modules.ShopApp:
        return 'Sklep'
      default:
        return ''
    }
  }

  static getModuleBadgeClass(subscriptionStatus: Modules) {
    switch (subscriptionStatus) {
      case Modules.ServiceApp:
        return 'badge bg-success'
      case Modules.ShopApp:
        return 'badge bg-primary'
      default:
        return ''
    }
  }
}
