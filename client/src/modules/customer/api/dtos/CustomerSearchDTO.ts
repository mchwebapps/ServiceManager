import type { CustomerSearchItemDTO } from '@/modules/customer/api/dtos/CustomerSearchItemDTO'

export class CustomerSearchDTO {
  items!: CustomerSearchItemDTO[]
  pageNumber?: number
  totalPages?: number
  totalCount?: number
}