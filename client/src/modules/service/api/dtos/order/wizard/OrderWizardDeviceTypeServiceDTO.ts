import type { OrderWizardDeviceTypeServiceActionDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardDeviceTypeServiceActionDTO"
import type { OrderWizardDeviceTypeServiceParameterDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardDeviceTypeServiceParameterDTO"

export class OrderWizardDeviceTypeServiceDTO {
  id!: number
  name!: string
  actions: OrderWizardDeviceTypeServiceActionDTO[] = []
  parameters: OrderWizardDeviceTypeServiceParameterDTO[] = []
}