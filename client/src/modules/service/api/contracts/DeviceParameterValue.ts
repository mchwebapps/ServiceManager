import type { ParameterValue } from "@/modules/service/api/contracts/parameter-value/ParameterValue"

export class DeviceParameterValue {
  parameterId!: number
  parameterName!: string
  parameterType!: string
  parameterValues!: ParameterValue[]
  isParameterChosen!: boolean
}
