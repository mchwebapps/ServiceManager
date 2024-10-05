import type { CustomerTypes } from '@/modules/customer/store/enums/StoreEnums'

export class CustomerSearchItemDTO {
  id!: number
  name?: string
  taxNumber?: string
  email?: string
  phone?: string
  customerType?: CustomerTypes
}