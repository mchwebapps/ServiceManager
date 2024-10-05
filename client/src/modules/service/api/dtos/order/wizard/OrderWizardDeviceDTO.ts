import type { OrderWizardDeviceTypeParameterDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardDeviceTypeParameterDTO"
import type { OrderWizardDeviceTypeServiceDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardDeviceTypeServiceDTO"

export class OrderWizardDeviceDTO {
  id!: number
  deviceTypeId!: number
  parameters!: OrderWizardDeviceTypeParameterDTO[]
  services!: OrderWizardDeviceTypeServiceDTO[]
  admissionDate: string = new Date().toISOString().slice(0, 10)
  deadline: string = new Date().toISOString().slice(0, 10)
  paymentTerm: string = new Date().toISOString().slice(0, 10)
  workerId: number = 0
}
