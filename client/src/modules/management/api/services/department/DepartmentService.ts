import { inject, injectable } from "tsyringe"
import type { IManagementApiService } from "@/modules/management/services/IManagementApiService"
import { Department } from "@/modules/management/api/contracts/department/Department"
import { DepartmentDTO } from "@/modules/management/api/dtos/department/DepartmentDTO"

export interface IDepartmentService {
  getDepartments(): Promise<DepartmentDTO[]>
  getDepartment(departmentId: number): Promise<DepartmentDTO>
  createDepartment(data: DepartmentDTO): Promise<void>
  updateDepartment(departmentId: number, data: DepartmentDTO): Promise<void>
  deleteDepartment(departmentId: number): Promise<void>
}

@injectable()
export class DepartmentService implements IDepartmentService {

  private _managementApiService: IManagementApiService

  constructor(@inject('IManagementApiService') managementApiService: IManagementApiService) {
    this._managementApiService = managementApiService
  }

  async getDepartments(): Promise<DepartmentDTO[]> {
    const url = 'http://localhost:4000/departments'
    const response = await this._managementApiService.get<Department[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new DepartmentDTO
      result.id = item.id
      result.name = item.name
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

  async getDepartment(departmentId: number): Promise<DepartmentDTO> {
    const url = `http://localhost:4000/departments/${departmentId}`
    const response = await this._managementApiService.get<Department>(url)
    const data = response.data
    const result = new DepartmentDTO
    result.id = data.id
    result.name = data.name
    result.firstName = data.firstName
    result.lastName = data.lastName
    result.companyName = data.companyName
    result.email = data.email
    result.phoneNumber = data.phoneNumber
    result.customerId = data.customerId
    result.street = data.street
    result.houseNo = data.houseNo
    result.flatNo = data.flatNo
    result.postCode = data.postCode
    result.city = data.city
    result.country = data.country
    return result
  }

  async createDepartment(data: DepartmentDTO): Promise<void> {
    const item = new Department
    item.name = data.name
    item.firstName = data.firstName
    item.lastName = data.lastName
    item.companyName = data.companyName
    item.email = data.email
    item.phoneNumber = data.phoneNumber
    item.customerId = data.customerId
    item.street = data.street
    item.houseNo = data.houseNo
    item.flatNo = data.flatNo
    item.postCode = data.postCode
    item.city = data.city
    item.country = data.country

    const url = `http://localhost:4000/departments`
    await this._managementApiService.post(url, item)
  }

  async updateDepartment(departmentId: number, data: DepartmentDTO): Promise<void> {
    const item = new Department
    item.name = data.name
    item.firstName = data.firstName
    item.lastName = data.lastName
    item.companyName = data.companyName
    item.email = data.email
    item.phoneNumber = data.phoneNumber
    item.customerId = data.customerId
    item.street = data.street
    item.houseNo = data.houseNo
    item.flatNo = data.flatNo
    item.postCode = data.postCode
    item.city = data.city
    item.country = data.country

    const url = `http://localhost:4000/departments/${departmentId}`
    await this._managementApiService.put(url, item)
  }

  async deleteDepartment(departmentId: number): Promise<void> {
    const url = `http://localhost:4000/departments/${departmentId}`
    await this._managementApiService.delete(url)
  }
}