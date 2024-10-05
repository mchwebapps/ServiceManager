import type { ParameterCategories, ParameterTypes } from "@/modules/service/store/enums/StoreEnums"
import type { ParameterValue } from "@/modules/service/api/contracts/parameter-value/ParameterValue"

export class OrderViewDeviceParameter {
  id!: number
  name!: string
  category!: ParameterCategories
  type!: ParameterTypes
  values!: ParameterValue[]
  value!: Array<number> | number | string
  isMain!: boolean
}