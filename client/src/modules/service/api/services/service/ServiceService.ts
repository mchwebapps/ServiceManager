import { inject, injectable } from "tsyringe"
import type { IServiceApiService } from "@/modules/service/services/IServiceApiService"
import { Service } from "@/modules/service/api/contracts/service/Service"
import type { ServiceAction } from "@/modules/service/api/contracts/service-action/ServiceAction"
import { ServiceDTO } from "@/modules/service/api/dtos/service/ServiceDTO"
import { ServiceActionDTO } from "@/modules/service/api/dtos/service-action/ServiceActionDTO"
import type { ServiceActionSelectItemDTO } from "@/modules/service/api/dtos/service-action/ServiceActionSelectItemDTO"
import type { ParameterDTO } from "@/modules/service/api/dtos/parameter/ParameterDTO"

export interface IServiceService {
  getServices(): Promise<ServiceDTO[]>
  getServicesForSelect(): Promise<ServiceDTO[]>
  getService(serviceId: number): Promise<ServiceDTO>

  createService(
    data: ServiceDTO,
    actions: ServiceActionDTO[],
    parameters: ParameterDTO[]
  ): Promise<void>

  updateService(
    serviceId: number,
    data: ServiceDTO,
    actions: ServiceActionDTO[],
    parameters: ParameterDTO[]
  ): Promise<void>

  deleteService(serviceId: number): Promise<void>
}

@injectable()
export class ServiceService implements IServiceService {

  private _serviceApiService: IServiceApiService

  constructor(@inject('IServiceApiService') serviceApiService: IServiceApiService) {
    this._serviceApiService = serviceApiService
  }

  async getServices(): Promise<ServiceDTO[]> {
    const url = 'http://localhost:4000/services'
    const response = await this._serviceApiService.get<Service[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new ServiceDTO
      result.id = item.id
      result.name = item.name
      result.actions = item.actions
      result.parameters = item.parameters
      return result
    })
  }

  async getServicesForSelect(): Promise<ServiceDTO[]> {
    const url = 'http://localhost:4000/services'
    const response = await this._serviceApiService.get<Service[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new ServiceDTO
      result.id = item.id
      result.name = item.name
      return result
    })
  }

  async getService(serviceId: number): Promise<ServiceDTO> {    
    const url = `http://localhost:4000/services/${serviceId}`
    const response = await this._serviceApiService.get<Service>(url)
    const data = response.data
    const result = new ServiceDTO

    const actionUrl = `http://localhost:4000/actions`
    const actionResponse = await this._serviceApiService.get<ServiceAction[]>(actionUrl)
    const actionsData = actionResponse.data
    
    if (data) {
      result.id = data.id
      result.name = data.name

      for (let i = 0; i < actionsData.length; i++) {
        const action = new ServiceActionDTO
        action.id = actionsData[i].id
        action.name = actionsData[i].name
        action.isChecked = actionsData[i].isChecked
        result.actions.push(action)
      }
      result.parameters = data.parameters
    }
    return result
  }

  async createService(
    data: ServiceDTO,
    actions: ServiceActionSelectItemDTO[],
    parameters: ParameterDTO[]
  ): Promise<void> {

    const item = new Service
    item.name = data.name
    item.actions = actions
    item.parameters = parameters

    const url = 'http://localhost:4000/services/'
    await this._serviceApiService.post(url, item)
  }

  async updateService(
    serviceId: number,
    data: ServiceDTO,
    actions: ServiceActionDTO[],
    parameters: ParameterDTO[]
  ): Promise<void> {

    const item = new Service
    item.name = data.name
    item.actions = actions
    item.parameters = parameters
    
    const url = `http://localhost:4000/services/${serviceId}`
    await this._serviceApiService.put(url, item)
  }

  async deleteService(serviceId: number): Promise<void> {
    const url = `http://localhost:4000/services/${serviceId}`
    await this._serviceApiService.delete(url)
  }
}