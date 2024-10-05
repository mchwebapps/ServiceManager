import { ParameterCategories, ParameterTypes } from "@/modules/service/store/enums/StoreEnums"

export class ParameterCategoryHelper {
  static getParameterCategoryName(category: ParameterCategories) {
    switch (category) {
      case ParameterCategories.Device:
        return 'Typ urządzenia'
      case ParameterCategories.Service:
        return 'Usługa'
      case ParameterCategories.System:
        return 'System'
    }
  }
}

export class ParameterTypeHelper {
  static getParameterTypeName(type: ParameterTypes) {
    switch (type) {
      case ParameterTypes.TextInput:
        return 'Pole tekstowe'
      case ParameterTypes.SingularSelection:
        return 'Pole jednokrotnego wyboru'
      case ParameterTypes.MultipleSelection:
        return 'Pole wielokrotnego wyboru'
      case ParameterTypes.Checkbox:
        return 'Pole typu checkbox'
      case ParameterTypes.TextArea:
        return 'Pole opisowe'
      case ParameterTypes.Special:
        return 'Pole specjalne'
      default:
        return 'brak'
    }
  }
}
