import { inject, injectable } from "tsyringe"
import type { IServiceApiService } from "@/modules/service/services/IServiceApiService"
import type { CommonDocumentType } from "@/core/contracts/management/document-type/CommonDocumentType"
import { DocumentTypeDTO } from "@/core/dtos/management/document-type/DocumentTypeDTO"

export interface ICommonDocumentTypeService {
  getDocumentTypes(): Promise<DocumentTypeDTO[]>
}

@injectable()
export class CommonDocumentTypeService implements ICommonDocumentTypeService {

  private _serviceApiService: IServiceApiService

  constructor(@inject('IServiceApiService') serviceApiService: IServiceApiService) {
    this._serviceApiService = serviceApiService
  }

  async getDocumentTypes(): Promise<DocumentTypeDTO[]> {
    const url = 'http://localhost:4000/documentTypes'
    const response = await this._serviceApiService.get<CommonDocumentType[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new DocumentTypeDTO
      result.id = item.id
      result.name = item.name
      return result
    })    
  }
}