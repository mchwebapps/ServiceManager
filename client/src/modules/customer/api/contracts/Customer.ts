import type { CustomerTypes } from '@/modules/customer/store/enums/StoreEnums'

export class Customer {
  id!: string
  name!: string
  taxNumber!: string
  customerType!: CustomerTypes
}
