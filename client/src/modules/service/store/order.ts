import type { OrderWizardDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardDTO"
import type { OrderWizardDeviceDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardDeviceDTO"
import { container } from "tsyringe"
import type { ICommonCustomerBillingService } from "@/core/services/customer/CommonCustomerBillingService"
import type { ICommonCustomerContactService } from "@/core/services/customer/CommonCustomerContactService"
import type { ICommonCustomerShippingService } from "@/core/services/customer/CommonCustomerShippingService"
import { defineStore } from "pinia"
import type { CommonCustomerBillingDTO } from "@/core/dtos/customer/CommonCustomerBillingDTO"
import type { CommonCustomerContactDTO } from "@/core/dtos/customer/CommonCustomerContactDTO"

const useOrderCreateForm = defineStore({
  id: 'orderCreateForm',
  state: () => ({ order: { departmentId: 1, customerId: '' } as OrderWizardDTO, step: 1 }),
  getters: {
    getOrder(state) {
      return state.order
    },
    getStep(state) {
      return state.step
    }
  },
  actions: {
    goNext(currentStep: number) {
      (currentStep < 3) ? this.step++ : this.step = currentStep
    },
    goBack(currentStep: number) {
      (currentStep > 0) ? this.step-- : this.step = currentStep
    },
    async setDepartmentId(departmentId: number) {
      this.order.departmentId = departmentId
    },
    async setCustomerId(customerId: string) {
      this.order.customerId = customerId

      const customerBillingService = container.resolve('ICommonCustomerBillingService') as ICommonCustomerBillingService
      const billings: CommonCustomerBillingDTO[] = await customerBillingService.getCustomerBillings(customerId)
      const billing = billings.find(x => x.isMain === true)
      this.setCustomerBillingId(billing?.id)

      const customerContactService = container.resolve('ICommonCustomerContactService') as ICommonCustomerContactService
      const contacts: CommonCustomerContactDTO[] = await customerContactService.getCustomerContacts(customerId)
      const contact = contacts.find(x => x.isMain === true)
      this.setCustomerContactId(contact?.id)

      const customerShippingService = container.resolve('ICommonCustomerShippingService') as ICommonCustomerShippingService
      const shippings: CommonCustomerContactDTO[] = await customerShippingService.getCustomerShippings(customerId)
      const shipping = shippings.find(x => x.isMain === true)
      this.setCustomerShippingId(shipping?.id)
    },
    setCustomerBillingId(billingId: number | undefined) {
      this.order.customerBillingId = billingId
    },
    setCustomerContactId(contactId: number | undefined) {
      this.order.customerContactId = contactId
    },
    setCustomerShippingId(shippingId: number | undefined) {
      this.order.customerShippingId = shippingId
    },
    setDevices(devices: OrderWizardDeviceDTO[]) {
      this.order.devices = devices
    },
    setDeliveryMethod(deliveryMethodId: number) {
      this.order.deliveryMethod = deliveryMethodId
    },
    setShippingMethod(shippingMethodId: number) {
      this.order.shippingMethod = shippingMethodId
    },
    setShippingCost(shippingCost: number) {
      this.order.shippingCost = shippingCost
    },
    setDocumentType(documentTypeId: number) {
      this.order.documentType = documentTypeId
    },
    setPaymentMethod(paymentMethodId: number) {
      this.order.paymentMethod = paymentMethodId
    },
    setPriceNoTax(priceNoTax: number) {
      this.order.priceNoTax = priceNoTax
    },
    setPaid(paid: number) {
      this.order.paid = paid
    },
    setPriceWithTax(priceWithTax: number) {
      this.order.priceWithTax = priceWithTax
    },
    setComment(comment: string) {
      this.order.comment = comment
    }
  }
})

export { useOrderCreateForm }