import { inject, injectable } from "tsyringe"
import type { IServiceApiService } from "@/modules/service/services/IServiceApiService"
import type { CommonDepartment } from "@/core/contracts/management/department/CommonDepartment"
import { DepartmentDTO } from "@/core/dtos/management/department/DepartmentDTO"

export interface ICommonDepartmentService {
  getDepartments(): Promise<DepartmentDTO[]>
}

@injectable()
export class CommonDepartmentService implements ICommonDepartmentService {

  private _serviceApiService: IServiceApiService

  constructor(@inject('IServiceApiService') serviceApiService: IServiceApiService) {
    this._serviceApiService = serviceApiService
  }

  async getDepartments(): Promise<DepartmentDTO[]> {
    const url = 'http://localhost:4000/departments'
    const response = await this._serviceApiService.get<CommonDepartment[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new DepartmentDTO
      result.id = item.id
      result.firstName = item.firstName
      result.lastName = item.lastName
      result.companyName = item.companyName
      result.email = item.email
      result.phoneNumber = item.phoneNumber
      result.customerId = item.customerId
      result.street = item.street
      result.houseNo = item.houseNo
      result.flatNo = item.flatNo
      result.postCode = item.postCode
      result.city = item.city
      result.country = item.country
      return result
    })    
  }
}