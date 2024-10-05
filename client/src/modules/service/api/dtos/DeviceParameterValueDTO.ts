import type { ParameterValueDTO } from "@/modules/service/api/dtos/parameter-value/ParameterValueDTO"

export class DeviceParameterValueDTO {
  parameterId!: number
  parameterName!: string
  parameterType!: string
  parameterValues!: ParameterValueDTO[]
  isParameterChosen?: boolean
}