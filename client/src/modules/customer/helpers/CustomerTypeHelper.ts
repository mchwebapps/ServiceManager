import { CustomerTypes } from '@/modules/customer/store/enums/StoreEnums'

export class CustomerTypeHelper {
  static getCustomerTypeName(type: CustomerTypes) {
    switch (type) {
      case CustomerTypes.Business:
        return 'Biznesowy'
      case CustomerTypes.Personal:
        return 'Indywidualny'
      default:
        return 'brak'
    }
  }
}
