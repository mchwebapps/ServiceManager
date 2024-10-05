import { inject, injectable } from "tsyringe"
import type { IServiceApiService } from "@/modules/service/services/IServiceApiService"
import type { AxiosResponse } from "axios"
import { Action } from "@/modules/service/api/contracts/action/Action"
import { ActionDTO } from "@/modules/service/api/dtos/action/ActionDTO"

export interface IActionService {
  getActions(): Promise<ActionDTO[]>
  getAction(actionId: number): Promise<ActionDTO>
  createActions(data: ActionDTO[]): Promise<void>
  updateAction(actionId: number, data: ActionDTO): Promise<void>
  deleteAction(actionId: number): Promise<void>
}

@injectable()
export class ActionService implements IActionService {

  private _serviceApiService: IServiceApiService

  constructor(@inject('IServiceApiService') serviceApiService: IServiceApiService) {
    this._serviceApiService = serviceApiService
  }

  async getActions(): Promise<ActionDTO[]> {
    const url = 'http://localhost:4000/actions'
    const response = await this._serviceApiService.get<Action[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new ActionDTO
      result.id = item.id
      result.name = item.name
      result.defaultRate = item.defaultRate
      return result
    })
  }

  async getAction(actionId: number): Promise<ActionDTO> {
    const url = `http://localhost:4000/actions/${actionId}`
    const response = await this._serviceApiService.get<Action>(url)
    const data = response.data
    const result = new ActionDTO
    
    if (data) {
      result.id = data.id
      result.name = data.name
      result.defaultRate = data.defaultRate
    }
    return result
  }

  async createActions(actions: ActionDTO[]): Promise<void> {
    const requests: Promise<AxiosResponse<any>>[] = []

    for (let i = 0; i < actions.length; i++) {
      const item = new Action
      item.name = actions[i].name
      item.defaultRate = actions[i].defaultRate

      const url = `http://localhost:4000/actions/`
      requests.push(this._serviceApiService.post(url, item)
      )
    }
    await Promise.all(requests)
  }

  async updateAction(actionId: number, data: ActionDTO): Promise<void> {
    const item = new Action
    item.name = data.name
    item.defaultRate = data.defaultRate
    
    const url = `http://localhost:4000/actions/${actionId}`
    await this._serviceApiService.put(url, item)
  }

  async deleteAction(actionId: number): Promise<void> {
    const url = `http://localhost:4000/actions/${actionId}`
    await this._serviceApiService.delete(url)
  }
}
