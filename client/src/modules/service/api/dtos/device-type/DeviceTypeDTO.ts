import type { ParameterDTO } from "@/modules/service/api/dtos/parameter/ParameterDTO"
import type { ServiceDTO } from "@/modules/service/api/dtos/service/ServiceDTO"

export class DeviceTypeDTO {
  id!: number
  name!: string
  parameters!: ParameterDTO[]
  services!: ServiceDTO[]
}