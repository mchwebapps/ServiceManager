import { AccountTypes } from '@/modules/subscription/api/enums/StoreEnums'

export class AccountTypeHelper {
  static getAccountTypeName(type: AccountTypes) {
    switch (type) {
      case AccountTypes.Business:
        return 'Konto firmowe'
      case AccountTypes.Personal:
        return 'Konto osobiste'
      default:
        return 'brak'
    }
  }
}
