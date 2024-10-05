import type { ParameterCategories, ParameterTypes } from "@/modules/service/store/enums/StoreEnums"

export class ParameterListDTO {
  id: number = 0
  name: string = ''
  alias: string = ''
  category!: ParameterCategories
  type!: ParameterTypes
}