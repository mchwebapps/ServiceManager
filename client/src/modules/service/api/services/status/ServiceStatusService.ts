import { inject, injectable } from "tsyringe"
import type { IServiceApiService } from "@/modules/service/services/IServiceApiService"
import { ServiceStatus } from "@/modules/service/api/contracts/status/ServiceStatus"
import { ServiceStatusDTO } from "@/modules/service/api/dtos/status/ServiceStatusDTO"

export interface IServiceStatusService {
  getStatuses(): Promise<ServiceStatusDTO[]>
  getStatus(id: number): Promise<ServiceStatusDTO>
  createStatus(data: ServiceStatusDTO): Promise<void>
  updateStatus(statusId: number, data: ServiceStatusDTO): Promise<void>
  deleteStatus(statusId: number): Promise<void>
}

@injectable()
export class ServiceStatusService implements IServiceStatusService {

  private _serviceApiService: IServiceApiService

  constructor(@inject('IServiceApiService') serviceApiService: IServiceApiService) {
    this._serviceApiService = serviceApiService
  }

  async getStatuses(): Promise<ServiceStatusDTO[]> {
    const url = 'http://localhost:4000/serviceStatuses'
    const response = await this._serviceApiService.get<ServiceStatus[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new ServiceStatusDTO
      result.id = item.id
      result.name = item.name
      result.emailMessage = item.emailMessage
      result.smsMessage = item.smsMessage
      result.order = item.order
      return result
    })    
  }

  async getStatus(id: number): Promise<ServiceStatusDTO> {
    const url = `http://localhost:4000/serviceStatuses/${id}`
    const response = await this._serviceApiService.get<ServiceStatus>(url)
    const data = response.data
    const result = new ServiceStatusDTO

    if (data) {
      result.id = data.id
      result.name = data.name
      result.emailMessage = data.emailMessage
      result.smsMessage = data.smsMessage
    }
    return result
  }

  async createStatus(data: ServiceStatusDTO): Promise<void> {
    const item = new ServiceStatus
    item.id = data.id
    item.name = data.name
    item.emailMessage = data.emailMessage
    item.smsMessage = data.smsMessage

    const url = `http://localhost:4000/serviceStatuses`
    await this._serviceApiService.post(url, item)
  }

  async updateStatus(statusId: number, data: ServiceStatusDTO): Promise<void> {
    const item = new ServiceStatus
    item.name = data.name
    item.emailMessage = data.emailMessage
    item.smsMessage = data.smsMessage
    
    const url = `http://localhost:4000/serviceStatuses/${statusId}`
    await this._serviceApiService.put(url, item)
  }

  async deleteStatus(statusId: number): Promise<void> {
    const url = `http://localhost:4000/serviceStatuses/${statusId}`
    await this._serviceApiService.delete(url)
  }
}