import { inject, injectable } from "tsyringe"
import type { IManagementApiService } from "@/modules/management/services/IManagementApiService"
import { DocumentType } from "@/modules/management/api/contracts/document-type/DocumentType"
import { DocumentTypeDTO } from "@/modules/management/api/dtos/document-type/DocumentTypeDTO"

export interface IDocumentTypeService {
  getDocumentTypes(): Promise<DocumentTypeDTO[]>
  getDocumentType(documentId: number): Promise<DocumentTypeDTO>
  createDocumentType(data: DocumentTypeDTO): Promise<void>
  updateDocumentType(documentId: number, data: DocumentTypeDTO): Promise<void>
  deleteDocumentType(documentId: number): Promise<void>
}

@injectable()
export class DocumentTypeService implements IDocumentTypeService {

  private _managementApiService: IManagementApiService

  constructor(@inject('IManagementApiService') managementApiService: IManagementApiService) {
    this._managementApiService = managementApiService
  }

  async getDocumentTypes(): Promise<DocumentTypeDTO[]> {
    const url = 'http://localhost:4000/documentTypes'
    const response = await this._managementApiService.get<DocumentType[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new DocumentTypeDTO
      result.id = item.id
      result.name = item.name
      return result
    })    
  }

  async getDocumentType(documentId: number): Promise<DocumentTypeDTO> {
    const url = `http://localhost:4000/documentTypes/${documentId}`
    const response = await this._managementApiService.get<DocumentType>(url)
    const data = response.data
    const result = new DocumentTypeDTO
    result.id = data.id
    result.name = data.name
    return result
  }

  async createDocumentType(data: DocumentTypeDTO): Promise<void> {
    const item = new DocumentType
    item.id = data.id
    item.name = data.name

    const url = `http://localhost:4000/documentTypes`
    await this._managementApiService.post(url, item)
  }

  async updateDocumentType(documentId: number, data: DocumentTypeDTO): Promise<void> {
    const item = new DocumentType
    item.name = data.name

    const url = `http://localhost:4000/documentTypes/${documentId}`
    await this._managementApiService.put(url, item)
  }

  async deleteDocumentType(documentId: number): Promise<void> {
    const url = `http://localhost:4000/documentTypes/${documentId}`
    await this._managementApiService.delete(url)
  }
}