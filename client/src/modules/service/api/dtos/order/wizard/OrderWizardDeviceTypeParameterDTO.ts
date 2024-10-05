import type { ParameterCategories, ParameterTypes } from "@/modules/service/store/enums/StoreEnums"
import type { ParameterValueDTO } from "@/modules/service/api/dtos/parameter-value/ParameterValueDTO"

export class OrderWizardDeviceTypeParameterDTO {
  id: number = 0
  name: string = ''
  category!: ParameterCategories
  type!: ParameterTypes
  values!: ParameterValueDTO[]
  value!: Array<number> | number | string
  get textValue() {

    if (typeof this.value === 'number') {
      const selected = this.values.find(x => x.id == this.value)
      return selected?.text
    }

    if (Array.isArray(this.value)) {
      const selectedValues = this.value as Array<number>
      const textValues = this.values.filter(x => selectedValues.some(y => x.id === y))
      return textValues.map(x => x.text).join(' ')
    }
    return this.value
  }
  isMain?: boolean
}