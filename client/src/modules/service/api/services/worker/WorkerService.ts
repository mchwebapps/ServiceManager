import { inject, injectable } from "tsyringe"
import type { IServiceApiService } from "@/modules/service/services/IServiceApiService"
import { Worker } from "@/modules/service/api/contracts/worker/Worker"
import type { WorkPosition } from "@/modules/service/api/contracts/work-position/WorkPosition"
import { WorkerDTO } from "@/modules/service/api/dtos/worker/WorkerDTO"
import { WorkerSelectItemDTO } from "@/modules/service/api/dtos/worker/WorkerSelectDTO"

export interface IWorkerService {
  getWorkers(): Promise<WorkerDTO[]>
  getWorkersForSelect(): Promise<WorkerSelectItemDTO[]>
  getWorker(id: number): Promise<WorkerDTO>
  createWorker(data: WorkerDTO): Promise<void>
  updateWorker(workerId: number, data: WorkerDTO): Promise<void>
  deleteWorker(workerId: number): Promise<void>
}

@injectable()
export class WorkerService implements IWorkerService {

  private _serviceApiService: IServiceApiService

  constructor(@inject('IServiceApiService') serviceApiService: IServiceApiService) {
    this._serviceApiService = serviceApiService
  }

  async getWorkers(): Promise<WorkerDTO[]> {
    const workerUrl = 'http://localhost:4000/workers'
    const workerResponse = await this._serviceApiService.get<Worker[]>(workerUrl)
    const workerData = workerResponse.data

    workerData.map(async (item) => {
      const result = new WorkerDTO
      const workPositionUrl = `http://localhost:4000/workPositions/${item.workPositionId}`
      const workPositionResponse = await this._serviceApiService.get<WorkPosition>(workPositionUrl)
      const workPositionData = workPositionResponse.data
      result.id = item.id
      result.firstName = item.firstName
      result.lastName = item.lastName
      result.workPositionId = item.workPositionId
      result.workPosition = workPositionData.name
      result.contractSince = item.contractSince
      result.contractTo = item.contractTo
      result.contractNoTerm = item.contractNoTerm
      result.salaryNoTax = item.salaryNoTax
      result.salaryWithTax = item.salaryWithTax
      return result
    })
    return workerData
  }

  async getWorkersForSelect(): Promise<WorkerSelectItemDTO[]> {
    const url = 'http://localhost:4000/workers'
    const response = await this._serviceApiService.get<Worker[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new WorkerSelectItemDTO
      result.id = item.id
      result.firstName = item.firstName
      result.lastName = item.lastName
      return result
    })
  }

  async getWorker(id: number): Promise<WorkerDTO> {
    const url = `http://localhost:4000/workers/${id}`
    const response = await this._serviceApiService.get<Worker>(url)
    const data = response.data
    const result = new WorkerDTO

    if (data) {
      result.id = data.id
      result.firstName = data.firstName
      result.lastName = data.lastName
      result.workPositionId = data.workPositionId
      result.workPosition = data.workPosition
      result.contractSince = data.contractSince
      result.contractTo = data.contractTo
      result.contractNoTerm = data.contractNoTerm
      result.salaryNoTax = data.salaryNoTax
      result.salaryWithTax = data.salaryWithTax
    }
    return result
  }

  async createWorker(data: WorkerDTO): Promise<void> {
    const workPositionUrl = `http://localhost:4000/workPositions/${data.workPositionId}`
    const workPositionResponse = await this._serviceApiService.get<WorkPosition>(workPositionUrl)
    const workPositionData = workPositionResponse.data
    
    const item = new Worker
    item.firstName = data.firstName
    item.lastName = data.lastName
    item.workPositionId = data.workPositionId
    item.workPosition = workPositionData.name
    item.contractSince = data.contractSince
    item.contractTo = data.contractTo
    item.contractNoTerm = data.contractNoTerm
    item.salaryNoTax = data.salaryNoTax
    item.salaryWithTax = data.salaryWithTax

    const url = 'http://localhost:4000/workers/'
    await this._serviceApiService.post(url, item)
  }

  async updateWorker(workerId: number, data: WorkerDTO): Promise<void> {
    const workPositionUrl = `http://localhost:4000/workPositions/${data.workPositionId}`
    const workPositionResponse = await this._serviceApiService.get<WorkPosition>(workPositionUrl)
    const workPositionData = workPositionResponse.data

    const item = new Worker
    item.firstName = data.firstName
    item.lastName = data.lastName
    item.workPositionId = data.workPositionId
    item.workPosition = workPositionData.name
    item.contractSince = data.contractSince
    item.contractTo = data.contractTo
    item.contractNoTerm = data.contractNoTerm
    item.salaryNoTax = data.salaryNoTax
    item.salaryWithTax = data.salaryWithTax
    
    const url = `http://localhost:4000/workers/${workerId}`
    await this._serviceApiService.put(url, item)
  }

  async deleteWorker(workerId: number): Promise<void> {
    const url = `http://localhost:4000/workers/${workerId}`
    await this._serviceApiService.delete(url)
  }
}