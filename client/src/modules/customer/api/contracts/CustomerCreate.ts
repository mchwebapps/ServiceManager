import type { CustomerTypes } from '@/modules/customer/store/enums/StoreEnums'

export class CustomerCreate {
  id!: string
  customerType!: CustomerTypes
  taxNumber?: string
  companyName?: string
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  street?: string
  houseNo?: string
  flatNo?: string
  postCode?: string
  city?: string
  country?: string
  accountNumber?: string
}
