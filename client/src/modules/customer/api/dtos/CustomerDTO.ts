import type { CustomerTypes } from '@/modules/customer/store/enums/StoreEnums'

export class CustomerDTO {
  id!: string
  name!: string
  taxNumber!: string
  customerType!: CustomerTypes
}
