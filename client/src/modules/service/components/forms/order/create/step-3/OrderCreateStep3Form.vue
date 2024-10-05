<template>
  <div class="container">
    <div class="row bg-light border rounded m-0 py-3 px-2">
      <div class="col-12">
        <h4 class="border-bottom mb-3 pb-3">Dostawa</h4>
      </div>
      <div class="col-12 col-xl-4">
        <div class="mb-3">
          <label class="form-label">Sposób dostarczenia:</label>
          <select class="form-select" autocomplete="off" v-model="order.deliveryMethod">
            <option value>Wybierz</option>
            <option
              v-for="delivery in orderDeliveryMethods"
              :key="delivery.id"
              :value="delivery.id"
            >
              {{ delivery.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-12 col-xl-4">
        <div class="mb-3">
          <label class="form-label">Rodzaj wysyłki:</label>
          <select class="form-select" autocomplete="off" v-model="order.shippingMethod">
            <option value>Wybierz</option>
            <option
              v-for="shipping in orderShippingMethods"
              :key="shipping.id"
              :value="shipping.id"
            >
              {{ shipping.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-12 col-xl-4">
        <div class="mb-3">
          <label class="form-label">Koszt wysyłki:</label>
          <input type="number" class="form-control" autocomplete="off" v-model="order.shippingCost">
        </div>
      </div>
    </div>
    <hr>
    <div class="row bg-light border rounded m-0 py-3 px-2">
      <div class="col-12">
        <h4 class="border-bottom mb-3 pb-3">Płatność</h4>
      </div>
      <div class="col-12 col-lg-6">
        <div class="mb-3">
          <label class="form-label">Rodzaj dokumentu:</label>
          <select class="form-select" autocomplete="off" v-model="order.documentType">
            <option value>Wybierz</option>
            <option
              v-for="document in orderDocumentTypes"
              :key="document.id"
              :value="document.id"
            >
              {{ document.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <div class="mb-3">
          <label class="form-label">Rodzaj płatności:</label>
          <select class="form-select" autocomplete="off" v-model="order.paymentMethod">
            <option value>Wybierz</option>
            <option
              v-for="payment in orderPaymentMethods"
              :key="payment.id"
              :value="payment.id"
            >
              {{ payment.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-12 col-lg-4">
        <div class="mb-3">
          <label class="form-label">Cena netto:</label>
          <input type="number" class="form-control" autocomplete="off" v-model="order.priceNoTax">
        </div>
      </div>
      <div class="col-12 col-lg-4">
        <div class="mb-3">
          <label class="form-label">Opłacono:</label>
          <input type="number" class="form-control" autocomplete="off" v-model="order.paid">
        </div>
      </div>
      <div class="col-12 col-lg-4">
        <div class="mb-3">
          <label class="form-label">Cena brutto:</label>
          <input type="number" class="form-control" autocomplete="off" v-model="order.priceWithTax">
        </div>
      </div>
    </div>
    <hr>
    <div class="row bg-light border rounded m-0 py-3 px-2">
      <div class="col-12">
        <div class="mb-3">
          <label class="form-label">Uwagi:</label>
          <textarea class="form-control" rows="2" autocomplete="off" v-model="order.comment"></textarea>
        </div>
      </div>
    </div>
  </div>
  <div class="container mt-3 mb-5">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between border-top pt-3">
          <button
            class="btn btn-primary"
            :disabled="buttonLocked"
            @click="orderStore.goBack(orderStore.getStep), saveOrder()"
          >
            Wstecz
          </button>
          <button
            class="btn btn-primary ms-auto"
            :disabled="buttonLocked"
            @click="createOrder()"
            v-if="orderStore.getStep == 3"
          >
            Zapisz
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { ref } from "vue"
import { useOrderCreateForm } from "@/modules/service/store/order"
import Swal from "sweetalert2"

import { container } from "tsyringe"
import type { IOrderCreateService } from "@/modules/service/api/services/order/OrderCreateService"
import { OrderWizardDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardDTO"
import type { OrderWizardDeliveryMethodDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardDeliveryMethodDTO"
import type { OrderWizardShippingMethodDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardShippingMethodDTO"
import type { OrderWizardDocumentTypeDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardDocumentTypeDTO"
import type { OrderWizardPaymentMethodDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardPaymentMethodDTO"
import type { OrderCreateDTO } from "@/modules/service/api/dtos/order/create/OrderCreateDTO"

import ValidationError from '@/core/errors/ValidationError'
import AppErrorItems from '@/components/AppErrorItems.vue'

const router = useRouter()
const orderStore = useOrderCreateForm()
const orderCreateService = container.resolve('IOrderCreateService') as IOrderCreateService
const order = ref<OrderWizardDTO>(new OrderWizardDTO)

order.value.deliveryMethod = orderStore.getOrder.deliveryMethod
order.value.shippingMethod = orderStore.getOrder.shippingMethod
order.value.shippingCost = orderStore.getOrder.shippingCost
order.value.documentType = orderStore.getOrder.documentType
order.value.paymentMethod = orderStore.getOrder.paymentMethod
order.value.priceNoTax = orderStore.getOrder.priceNoTax
order.value.paid = orderStore.getOrder.paid
order.value.priceWithTax = orderStore.getOrder.priceWithTax
order.value.comment = orderStore.getOrder.comment

const orderDeliveryMethods = ref<OrderWizardDeliveryMethodDTO[]>([])
const orderDocumentTypes = ref<OrderWizardDocumentTypeDTO[]>([])
const orderPaymentMethods = ref<OrderWizardPaymentMethodDTO[]>([])
const orderShippingMethods = ref<OrderWizardShippingMethodDTO[]>([])

orderDeliveryMethods.value = await orderCreateService.getDeliveryMethods()
orderDocumentTypes.value = await orderCreateService.getDocumentTypes()
orderPaymentMethods.value = await orderCreateService.getPaymentMethods()
orderShippingMethods.value = await orderCreateService.getShippingMethods()

const buttonLocked = ref<boolean>(false)
let validationErrors = ref<{key: string, errorMessage: string}[]>([])

const saveOrder = () => {
  orderStore.setDeliveryMethod(order.value.deliveryMethod)
  orderStore.setShippingMethod(order.value.shippingMethod)
  orderStore.setShippingCost(order.value.shippingCost)
  orderStore.setDocumentType(order.value.documentType)
  orderStore.setPaymentMethod(order.value.paymentMethod)
  orderStore.setPriceNoTax(order.value.priceNoTax)
  orderStore.setPaid(order.value.paid)
  orderStore.setPriceWithTax(order.value.priceWithTax)
  orderStore.setComment(order.value.comment)
}

const createOrder = async () => {
  saveOrder()

  try {
    buttonLocked.value = true
    validationErrors.value = []

    // const orderCreate = new OrderCreateDTO
    // orderCreate.departmentId = orderStore.getOrder.departmentId
    // orderCreate.customerId = orderStore.getOrder.customerId
    // orderCreate.customerBillingId = orderStore.getOrder.customerBillingId
    // orderCreate.customerShippingId = orderStore.getOrder.customerShippingId
    // orderCreate.customerContactId = orderStore.getOrder.customerContactId
    
    // for (const device of orderStore.getOrder.devices) {
    //   orderCreate.devices.map((item) => {
        
    //   })
    // }

    await orderCreateService.createOrder(orderStore.getOrder as OrderCreateDTO)

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Zlecenie utworzone',
      timer: 1000,
      showConfirmButton: false,
      showCloseButton: false,
    }).then(() => {
      router.push('/service/orders')
      buttonLocked.value = false
      order.value = new OrderWizardDTO
    })
  }
  catch (error: any) {
    if (error instanceof ValidationError) {
      validationErrors.value = Object.keys(error.Errors).map(key => {
        const arr = error.Errors[key] as []
        return { key,errorMessage:arr.join(',') }
      })
      buttonLocked.value = false
      return
    }
    Swal.fire({
      title: 'Błąd serwera!',
      html: 'Sprawdź szczegółowe komunikaty lub odśwież stronę i spróbuj ponownie.',
      icon: 'error',
      showConfirmButton: true,
    }).then(() => {
      buttonLocked.value = false
    })
  }

  console.log(orderStore.getOrder)
}
</script>