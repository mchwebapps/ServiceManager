import { inject, injectable } from "tsyringe"
import type { IServiceApiService } from "@/modules/service/services/IServiceApiService"
import { DeviceType } from "@/modules/service/api/contracts/device-type/DeviceType"
import { DeviceTypeDTO } from "@/modules/service/api/dtos/device-type/DeviceTypeDTO"
import type { ParameterDTO } from "@/modules/service/api/dtos/parameter/ParameterDTO"
import type { ServiceDTO } from "@/modules/service/api/dtos/service/ServiceDTO"

export interface IDeviceTypeService {
  getDeviceTypes(): Promise<DeviceTypeDTO[]>
  getDeviceType(deviceTypeId: number): Promise<DeviceTypeDTO>

  createDeviceType(
    data: DeviceTypeDTO,
    parameters: ParameterDTO[],
    services: ServiceDTO[]
  ): Promise<void>

  updateDeviceType(
    deviceTypeId: number,
    data: DeviceTypeDTO,
    parameters: ParameterDTO[],
    services: ServiceDTO[]
  ): Promise<void>

  deleteDeviceType(deviceTypeId: number): Promise<void>
}

@injectable()
export class DeviceTypeService implements IDeviceTypeService {

  private _serviceApiService: IServiceApiService

  constructor(@inject('IServiceApiService') serviceApiService: IServiceApiService) {
    this._serviceApiService = serviceApiService
  }

  async getDeviceTypes(): Promise<DeviceTypeDTO[]> {
    const url = 'http://localhost:4000/deviceTypes'
    const response = await this._serviceApiService.get<DeviceType[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new DeviceTypeDTO
      result.id = item.id
      result.name = item.name
      result.parameters = item.parameters
      result.services = item.services
      return result
    })
  }

  async getDeviceType(deviceTypeId: number): Promise<DeviceTypeDTO> {
    const url = `http://localhost:4000/deviceTypes/${deviceTypeId}`
    const response = await this._serviceApiService.get<DeviceType>(url)
    const data = response.data
    const result = new DeviceTypeDTO

    if (data) {
      result.id = data.id
      result.name = data.name
      result.parameters = data.parameters
      result.services = data.services
    }
    return result
  }

  async createDeviceType(
    data: DeviceTypeDTO,
    parameters: ParameterDTO[],
    services: ServiceDTO[]
  )
  : Promise<void> {
    const item = new DeviceType
    item.name = data.name
    item.parameters = parameters
    item.services = services

    const url = 'http://localhost:4000/deviceTypes/'
    await this._serviceApiService.post(url, item)
  }

  async updateDeviceType(
    deviceTypeId: number,
    data: DeviceTypeDTO,
    parameters: ParameterDTO[],
    services: ServiceDTO[]
  )
  : Promise<void> {
    const item = new DeviceType
    item.name = data.name
    item.parameters = parameters
    item.services = services

    const url = `http://localhost:4000/deviceTypes/${deviceTypeId}`
    await this._serviceApiService.put(url, item)
  }

  async deleteDeviceType(deviceTypeId: number): Promise<void> {
    const url = `http://localhost:4000/deviceTypes/${deviceTypeId}`
    await this._serviceApiService.delete(url)
  }
}