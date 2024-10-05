import type { ServiceAction } from "@/modules/service/api/contracts/service-action/ServiceAction"
import type { ParameterDTO } from "@/modules/service/api/dtos/parameter/ParameterDTO"

export class Service {
  id!: number
  name!: string
  actions: ServiceAction[] = []
  parameters: ParameterDTO[] = []
  price!: number
}