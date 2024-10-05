import { inject, injectable } from "tsyringe"
import type { IServiceApiService } from "@/modules/service/services/IServiceApiService"
import { Service } from "@/modules/service/api/contracts/service/Service"
import { ServiceAction } from "@/modules/service/api/contracts/service-action/ServiceAction"
import { ServiceActionDTO } from "@/modules/service/api/dtos/service-action/ServiceActionDTO"

export interface IServiceActionService {
  getServiceActionsForEdit(serviceId: number): Promise<ServiceActionDTO[]>
  getServiceAction(serviceId: number): Promise<ServiceActionDTO>
  createServiceAction(data: ServiceActionDTO): Promise<void>
  updateServiceActions(serviceActionId: number, actions: ServiceActionDTO[]): Promise<void>
  deleteServiceAction(serviceActionId: number): Promise<void>
}

@injectable()
export class ServiceActionService implements IServiceActionService {

  private _serviceApiService: IServiceApiService

  constructor(@inject('IServiceApiService') serviceApiService: IServiceApiService) {
    this._serviceApiService = serviceApiService
  }

  async getServiceActionsForEdit(serviceId: number): Promise<ServiceActionDTO[]> {    
    const url = `http://localhost:4000/services/${serviceId}`
    const response = await this._serviceApiService.get<Service>(url)
    const actionUrl = `http://localhost:4000/actions`
    const actionResponse = await this._serviceApiService.get<ServiceAction[]>(actionUrl)
    const all = actionResponse.data
    const active = response.data.actions
    const result: ServiceActionDTO[] = []
    
    for (let i = 0; i < all.length; i++) {
      const one = new ServiceActionDTO
      one.id = all[i].id
      one.name = all[i].name
      one.isChecked = active.some(x => x.id == all[i].id)
      result.push(one)
    }
    return result
  }

  async getServiceAction(serviceId: number): Promise<ServiceActionDTO> {
    const url = `http://localhost:4000/serviceActions/${serviceId}`
    const response = await this._serviceApiService.get<ServiceAction>(url)
    const data = response.data
    const result = new ServiceActionDTO
    
    if (data) {
      result.id = data.id
      result.name = data.name
    }
    return result
  }

  async createServiceAction(data: ServiceActionDTO): Promise<void> {
    const item = new ServiceAction
    item.name = data.name

    const url = 'http://localhost:4000/serviceActions/'
    await this._serviceApiService.post(url, item)
  }

  async updateServiceActions(serviceActionId: number, actions: ServiceActionDTO[]): Promise<void> {
    const contract = new Service
    contract.actions = actions
    
    const url = `http://localhost:4000/services/${serviceActionId}`
    await this._serviceApiService.put(url, contract)
  }

  async deleteServiceAction(serviceActionId: number): Promise<void> {
    const url = `http://localhost:4000/serviceActions/${serviceActionId}`
    await this._serviceApiService.delete(url)
  }
}