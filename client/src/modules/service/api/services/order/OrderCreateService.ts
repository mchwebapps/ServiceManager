import { inject, injectable } from "tsyringe"
import type { IServiceApiService } from "@/modules/service/services/IServiceApiService"

import { OrderCreate } from "@/modules/service/api/contracts/order/create/OrderCreate"
import type { DeviceType } from "@/modules/service/api/contracts/device-type/DeviceType"
import type { CommonDepartment } from "@/core/contracts/management/department/CommonDepartment"
import type { Worker } from "@/modules/service/api/contracts/worker/Worker"
import type { CommonDeliveryMethod } from "@/core/contracts/management/delivery-method/CommonDeliveryMethod"
import type { CommonDocumentType } from "@/core/contracts/management/document-type/CommonDocumentType"
import type { CommonPaymentMethod } from "@/core/contracts/management/payment-method/CommonPaymentMethod"
import type { CommonShippingMethod } from "@/core/contracts/management/shipping-method/CommonShippingMethod"

import type { OrderCreateDTO } from "@/modules/service/api/dtos/order/create/OrderCreateDTO"
import { OrderWizardDeviceTypeDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardDeviceTypeDTO"
import { OrderWizardDeviceTypeParameterDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardDeviceTypeParameterDTO"
import { OrderWizardDeviceTypeServiceDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardDeviceTypeServiceDTO"
import { OrderWizardDepartmentDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardDepartmentDTO"
import { OrderWizardWorkerDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardWorkerDTO"
import { OrderWizardDeliveryMethodDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardDeliveryMethodDTO"
import { OrderWizardDocumentTypeDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardDocumentTypeDTO"
import { OrderWizardPaymentMethodDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardPaymentMethodDTO"
import { OrderWizardShippingMethodDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardShippingMethodDTO"

export interface IOrderCreateService {
  createOrder(data: OrderCreateDTO): Promise<void>

  getDepartments(): Promise<OrderWizardDepartmentDTO[]>
  getDeviceTypes(): Promise<OrderWizardDeviceTypeDTO[]>
  getDeviceTypeParameters(deviceTypeId: number): Promise<OrderWizardDeviceTypeParameterDTO[]>
  getDeviceTypeServices(deviceTypeId: number): Promise<OrderWizardDeviceTypeServiceDTO[]>
  getWorkers(): Promise<OrderWizardWorkerDTO[]> 
  getDeliveryMethods(): Promise<OrderWizardDeliveryMethodDTO[]>
  getDocumentTypes(): Promise<OrderWizardDocumentTypeDTO[]>
  getPaymentMethods(): Promise<OrderWizardPaymentMethodDTO[]>
  getShippingMethods(): Promise<OrderWizardShippingMethodDTO[]>
}

@injectable()
export class OrderCreateService implements IOrderCreateService {

  private _serviceApiService: IServiceApiService

  constructor(@inject('IServiceApiService') serviceApiService: IServiceApiService) {
    this._serviceApiService = serviceApiService
  }

  async createOrder(data: OrderCreateDTO): Promise<void> {
    const result = new OrderCreate
    result.departmentId = data.departmentId
    result.customerId = data.customerId
    result.customerBillingId = data.customerBillingId
    result.customerShippingId = data.customerShippingId
    result.customerContactId = data.customerContactId
    result.devices = data.devices
    result.deliveryMethod = data.deliveryMethod
    result.shippingMethod = data.shippingMethod
    result.shippingCost = data.shippingCost
    result.documentType = data.documentType
    result.paymentMethod = data.paymentMethod
    result.priceNoTax = data.priceNoTax
    result.paid = data.paid
    result.priceWithTax = data.priceWithTax
    result.comment = data.comment

    const url = 'http://localhost:4000/orders'
    await this._serviceApiService.post(url, result)
    console.log('created')
  }

  async getDepartments(): Promise<OrderWizardDepartmentDTO[]> {
    const url = 'http://localhost:4000/departments'
    const response = await this._serviceApiService.get<CommonDepartment[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new OrderWizardDepartmentDTO
      result.id = item.id
      result.firstName = item.firstName
      result.lastName = item.lastName
      result.companyName = item.companyName
      result.email = item.email
      result.phoneNumber = item.phoneNumber
      result.customerId = item.customerId
      result.street = item.street
      result.houseNo = item.houseNo
      result.flatNo = item.flatNo
      result.postCode = item.postCode
      result.city = item.city
      result.country = item.country
      return result
    })
  }

  async getDeviceTypes(): Promise<OrderWizardDeviceTypeDTO[]> {
    const url = 'http://localhost:4000/deviceTypes'
    const response = await this._serviceApiService.get<DeviceType[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new OrderWizardDeviceTypeDTO
      result.id = item.id
      result.name = item.name
      return result
    })
  }

  async getDeviceTypeParameters(deviceTypeId: number): Promise<OrderWizardDeviceTypeParameterDTO[]> {
    const url = `http://localhost:4000/deviceTypes/${deviceTypeId}`
    const response = await this._serviceApiService.get<DeviceType>(url)
    const data = response.data.parameters

    return data.map((item) => {
      const result = new OrderWizardDeviceTypeParameterDTO
      result.id = item.id
      result.name = item.name
      result.category = item.category
      result.type = item.type
      result.values = item.values
      result.value = item.value
      result.isMain = item.isMain
      return result
    })
  }

  async getDeviceTypeServices(deviceTypeId: number): Promise<OrderWizardDeviceTypeServiceDTO[]> {
    const url = `http://localhost:4000/deviceTypes/${deviceTypeId}`
    const response = await this._serviceApiService.get<DeviceType>(url)
    const data = response.data.services

    return data.map((item) => {
      const result = new OrderWizardDeviceTypeServiceDTO
      result.id = item.id
      result.name = item.name
      result.parameters = item.parameters
      return result
    })
  }

  async getWorkers(): Promise<OrderWizardWorkerDTO[]> {
    const url = 'http://localhost:4000/workers'
    const response = await this._serviceApiService.get<Worker[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new OrderWizardWorkerDTO
      result.id = item.id
      result.firstName = item.firstName
      result.lastName = item.lastName
      return result
    })
  }

  async getDeliveryMethods(): Promise<OrderWizardDeliveryMethodDTO[]> {
    const url = 'http://localhost:4000/deliveryMethods'
    const response = await this._serviceApiService.get<CommonDeliveryMethod[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new OrderWizardDeliveryMethodDTO
      result.id = item.id
      result.name = item.name
      return result
    })
  }

  async getDocumentTypes(): Promise<OrderWizardDocumentTypeDTO[]> {
    const url = 'http://localhost:4000/documentTypes'
    const response = await this._serviceApiService.get<CommonDocumentType[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new OrderWizardDocumentTypeDTO
      result.id = item.id
      result.name = item.name
      return result
    })
  }

  async getPaymentMethods(): Promise<OrderWizardPaymentMethodDTO[]> {
    const url = 'http://localhost:4000/paymentMethods'
    const response = await this._serviceApiService.get<CommonPaymentMethod[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new OrderWizardPaymentMethodDTO
      result.id = item.id
      result.name = item.name
      return result
    })
  }

  async getShippingMethods(): Promise<OrderWizardShippingMethodDTO[]> {
    const url = 'http://localhost:4000/shippingMethods'
    const response = await this._serviceApiService.get<CommonShippingMethod[]>(url)
    const data = response.data

    return data.map((item) => {
      const result = new OrderWizardShippingMethodDTO
      result.id = item.id
      result.name = item.name
      return result
    })
  }
}