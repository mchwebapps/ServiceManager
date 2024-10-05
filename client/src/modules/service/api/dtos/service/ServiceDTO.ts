import type { ServiceActionDTO } from "@/modules/service/api/dtos/service-action/ServiceActionDTO"
import type { ParameterDTO } from "@/modules/service/api/dtos/parameter/ParameterDTO"

export class ServiceDTO {
  id!: number
  name!: string
  actions: ServiceActionDTO[] = []
  parameters: ParameterDTO[] = []
}