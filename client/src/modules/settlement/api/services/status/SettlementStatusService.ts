import axios from "axios"
import { SettlementStatus } from "@/modules/settlement/api/contracts/status/SettlementStatus"
import { SettlementStatusDTO } from "@/modules/settlement/api/dtos/status/SettlementStatusDTO"


export interface ISettlementStatusService {
  getStatuses(): Promise<SettlementStatusDTO[]>
  getStatus(id: number): Promise<SettlementStatusDTO>
  createStatus(data: SettlementStatusDTO): Promise<void>
  updateStatus(statusId: number, data: SettlementStatusDTO): Promise<void>
  deleteStatus(statusId: number): Promise<void>
}

export class SettlementStatusService implements ISettlementStatusService {

  async getStatuses(): Promise<SettlementStatusDTO[]> {
    const url = 'http://localhost:4000/settlementStatuses'
    const response = await axios.get<SettlementStatus[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new SettlementStatusDTO
      result.id = item.id
      result.name = item.name
      result.emailMessage = item.emailMessage
      result.smsMessage = item.smsMessage
      return result
    })    
  }

  async getStatus(id: number): Promise<SettlementStatusDTO> {
    const url = `http://localhost:4000/settlementStatuses/${id}`
    const response = await axios.get<SettlementStatus>(url)
    const data = response.data
    const result = new SettlementStatusDTO

    if (data) {
      result.id = data.id
      result.name = data.name
      result.emailMessage = data.emailMessage
      result.smsMessage = data.smsMessage
    }
    return result
  }

  async createStatus(data: SettlementStatusDTO): Promise<void> {
    const item = new SettlementStatus
    item.id = data.id
    item.name = data.name
    item.emailMessage = data.emailMessage
    item.smsMessage = data.smsMessage

    const url = `http://localhost:4000/settlementStatuses`
    await axios.post(url, item)
  }

  async updateStatus(statusId: number, data: SettlementStatusDTO): Promise<void> {
    const item = new SettlementStatus
    item.name = data.name
    item.emailMessage = data.emailMessage
    item.smsMessage = data.smsMessage
    
    const url = `http://localhost:4000/settlementStatuses/${statusId}`
    await axios.put(url, item)
  }

  async deleteStatus(statusId: number): Promise<void> {
    const url = `http://localhost:4000/settlementStatuses/${statusId}`
    await axios.delete(url)
  }
}