import type { ParameterCategories, ParameterTypes } from "@/modules/service/store/enums/StoreEnums"
import type { ParameterValueDTO } from "@/modules/service/api/dtos/parameter-value/ParameterValueDTO"

export class OrderViewDeviceParameterDTO {
  id!: number
  name!: string
  category!: ParameterCategories
  type!: ParameterTypes
  values!: ParameterValueDTO[]
  value!: Array<number> | number | string
  isMain!: boolean
}