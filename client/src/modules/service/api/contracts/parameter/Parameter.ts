import type { ParameterCategories, ParameterTypes } from "@/modules/service/store/enums/StoreEnums"
import type { ParameterValue } from "@/modules/service/api/contracts/parameter-value/ParameterValue"

export class Parameter {
  id: number = 0
  name: string = ''
  alias: string = ''
  category!: ParameterCategories
  type!: ParameterTypes
  values!: ParameterValue[]
  value!: Array<number> | number | string
  isRequired?: boolean
  isMain?: boolean
}