import { inject, injectable } from "tsyringe"
import type { IServiceApiService } from "@/modules/service/services/IServiceApiService"
import { Parameter } from "@/modules/service/api/contracts/parameter/Parameter"
import { ParameterDTO } from "@/modules/service/api/dtos/parameter/ParameterDTO"
import { ParameterListDTO } from "@/modules/service/api/dtos/parameter/ParameterListDTO"
import type { ParameterViewDTO } from "@/modules/service/api/dtos/parameter/ParameterViewDTO"
import type { ParameterCreateDTO } from "@/modules/service/api/dtos/parameter/ParameterCreateDTO"

export interface IParameterService {
  getParameters(category: string): Promise<ParameterListDTO[]>
  getParameter(id: number): Promise<ParameterDTO>
  createParameter(data: ParameterCreateDTO): Promise<number>
  updateParameter(parameterId: number, data: ParameterViewDTO): Promise<void>
  deleteParameter(parameterId: number): Promise<void>

  getParametersForSelect(category: string): Promise<ParameterDTO[]>
  getParameterAsSelectedItem(id: number): Promise<ParameterDTO>
}

@injectable()
export class ParameterService implements IParameterService {

  private _serviceApiService: IServiceApiService

  constructor(@inject('IServiceApiService') serviceApiService: IServiceApiService) {
    this._serviceApiService = serviceApiService
  }

  async getParameters(category: string): Promise<ParameterListDTO[]> {
    const url = `http://localhost:4000/parameters?category=${category}`
    const response = await this._serviceApiService.get<Parameter[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new ParameterListDTO
      result.category = item.category
      result.id = item.id
      result.name = item.name
      result.alias = item.alias
      result.type = item.type
      return result
    })
  }

  async getParameter(id: number): Promise<ParameterDTO> {
    const url = `http://localhost:4000/parameters/${id}`
    const response = await this._serviceApiService.get<Parameter>(url)
    const data = response.data
    const result = new ParameterDTO
    
    if (data) {
      result.category = data.category
      result.id = data.id
      result.name = data.name
      result.alias = data.alias
      result.type = data.type
      result.isRequired = data.isRequired
      result.values = data.values
    }
    return result
  }

  async createParameter(data: ParameterCreateDTO): Promise<number> {
    const item = new Parameter
    item.category = data.category
    item.name = data.name
    item.alias = data.alias
    item.type = data.type
    item.isRequired = data.isRequired
    item.values = data.values

    const url = 'http://localhost:4000/parameters'
    const response = await this._serviceApiService.post(url, item)
    return response.data.id
  }

  async updateParameter(parameterId: number, data: ParameterViewDTO): Promise<void> {
    const item = new Parameter
    item.name = data.name
    item.alias = data.alias
    item.category = data.category
    item.type = data.type
    item.isRequired = data.isRequired

    const url = `http://localhost:4000/parameters/${parameterId}`
    await this._serviceApiService.put(url, item)
  }

  async deleteParameter(parameterId: number): Promise<void> {
    const url = `http://localhost:4000/parameters/${parameterId}`
    await this._serviceApiService.delete(url)
  }

  async getParametersForSelect(category: string): Promise<ParameterDTO[]> {
    const url = `http://localhost:4000/parameters?category=${category}`
    const response = await this._serviceApiService.get<Parameter[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new ParameterDTO
      result.id = item.id
      result.name = item.name
      result.category = item.category
      result.type = item.type
      return result
    })
  }

  async getParameterAsSelectedItem(id: number): Promise<ParameterDTO> {
    const url = `http://localhost:4000/parameters/${id}`
    const response = await this._serviceApiService.get<Parameter>(url)
    const data = response.data
    const result = new ParameterDTO

    if (data) {
      result.id = data.id
      result.category = data.category
      result.name = data.name
      // result.value = data.value
      result.type = data.type
    }
    console.log(result)
    return result
  }
}