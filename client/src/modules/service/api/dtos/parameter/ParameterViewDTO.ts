import type { ParameterCategories, ParameterTypes } from "@/modules/service/store/enums/StoreEnums"
import type { ParameterValueDTO } from "@/modules/service/api/dtos/parameter-value/ParameterValueDTO"

export class ParameterViewDTO {
  id: number = 0
  category!: ParameterCategories
  name: string = ''
  alias: string = ''
  type!: ParameterTypes
  isRequired?: boolean
  values!: ParameterValueDTO[]
}