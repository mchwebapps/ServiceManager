import { inject, injectable } from "tsyringe"
import type { IServiceApiService } from "@/modules/service/services/IServiceApiService"
import type { AxiosResponse } from "axios"
import { ParameterValue } from "@/modules/service/api/contracts/parameter-value/ParameterValue"
import { ParameterValueDTO } from "@/modules/service/api/dtos/parameter-value/ParameterValueDTO"

export interface IParameterValueService {
  getParameterValues(parameterId: number): Promise<ParameterValueDTO[]>
  createParameterValues(parameterId: number, values: ParameterValueDTO[]): Promise<void>
  updateParameterValue(parameterId: number, parameterValueId: number, data: ParameterValueDTO): Promise<void>
  deleteParameterValue(parameterValueId: number): Promise<void>
  deleteParameterValues(parameterId: number): Promise<void>
}

@injectable()
export class ParameterValueService implements IParameterValueService {

  private _serviceApiService: IServiceApiService

  constructor(@inject('IServiceApiService') serviceApiService: IServiceApiService) {
    this._serviceApiService = serviceApiService
  }

  async getParameterValues(parameterId: number): Promise<ParameterValueDTO[]> {
    const url = `http://localhost:4000/parameterValues?parameterId=${parameterId}`
    const response = await this._serviceApiService.get<ParameterValue[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new ParameterValueDTO
      result.id = item.id
      result.text = item.text
      result.parameterId = item.parameterId
      return result
    })
  }

  async createParameterValues(parameterId: number, values: ParameterValueDTO[]): Promise<void> {
    const requests: Promise<AxiosResponse<any>>[] = []

    for (let i = 0; i < values.length; i++) {
      const item = new ParameterValueDTO
      item.text = values[i].text
      item.parameterId = parameterId

      const url = `http://localhost:4000/parameterValues/`
      requests.push(this._serviceApiService.post(url, item)
      )
    }
    await Promise.all(requests)
  }

  async updateParameterValue(parameterId: number, parameterValueId: number, data: ParameterValueDTO): Promise<void> {
    const contract = new ParameterValue
    contract.text = data.text
    contract.parameterId = parameterId
    
    const url = `http://localhost:4000/parameterValues/${parameterValueId}`
    await this._serviceApiService.put(url, contract)
  }

  async deleteParameterValue(parameterValueId: number): Promise<void> {
    const url = `http://localhost:4000/parameterValues/${parameterValueId}`
    await this._serviceApiService.delete(url)
  }

  async deleteParameterValues(parameterId: number): Promise<void> {
    const url = `http://localhost:4000/parameterValues?parameterId=${parameterId}`
    await this._serviceApiService.delete(url)
  }
}