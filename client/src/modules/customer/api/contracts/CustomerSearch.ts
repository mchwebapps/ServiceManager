import type { CustomerTypes } from '@/modules/customer/store/enums/StoreEnums'

export class CustomerSearch {
  items!: CustomerSearchItem[]
  pageNumber?: number
  totalPages?: number
  totalCount?: number
}

export class CustomerSearchItem {
  id!: number
  name?: string
  taxNumber?: string
  email?: string
  phone?: string
  customerType?: CustomerTypes
}
