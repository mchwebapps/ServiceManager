import { inject, injectable } from "tsyringe"
import type { IServiceApiService } from "@/modules/service/services/IServiceApiService"
import { WorkPosition } from "@/modules/service/api/contracts/work-position/WorkPosition"
import { WorkPositionDTO } from "@/modules/service/api/dtos/work-position/WorkPositionDTO"

export interface IWorkPositionService {
  getWorkPositions(): Promise<WorkPositionDTO[]>
  getWorkPosition(id: number): Promise<WorkPositionDTO>
  createWorkPosition(data: WorkPositionDTO): Promise<void>
  updateWorkPosition(id: number, data: WorkPositionDTO): Promise<void>
  deleteWorkPosition(id: number): Promise<void>
}

@injectable()
export class WorkPositionService implements IWorkPositionService {

  private _serviceApiService: IServiceApiService

  constructor(@inject('IServiceApiService') serviceApiService: IServiceApiService) {
    this._serviceApiService = serviceApiService
  }

  async getWorkPositions(): Promise<WorkPositionDTO[]> {
    const url = 'http://localhost:4000/workPositions'
    const response = await this._serviceApiService.get<WorkPosition[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new WorkPositionDTO
      result.id = item.id
      result.name = item.name
      return result
    })
  }

  async getWorkPosition(id: number): Promise<WorkPositionDTO> {
    const url = `http://localhost:4000/workPositions/${id}`
    const response = await this._serviceApiService.get<WorkPosition>(url)
    const data = response.data
    const result = new WorkPositionDTO

    if (data) {
      result.id = data.id
      result.name = data.name
    }
    return result
  }

  async createWorkPosition(data: WorkPositionDTO): Promise<void> {
    const position = new WorkPosition
    position.id = data.id
    position.name = data.name
    
    const url = 'http://localhost:4000/workPositions'
    await this._serviceApiService.post(url, position)
  }

  async updateWorkPosition(id: number, data: WorkPositionDTO): Promise<void> {
    const position = new WorkPosition
    position.id = data.id
    position.name = data.name

    const url = `http://localhost:4000/workPositions/${id}`
    await this._serviceApiService.put(url, position)
  }

  async deleteWorkPosition(id: number): Promise<void> {
    const url = `http://localhost:4000/workPositions/${id}`
    await this._serviceApiService.delete(url)
  }
}