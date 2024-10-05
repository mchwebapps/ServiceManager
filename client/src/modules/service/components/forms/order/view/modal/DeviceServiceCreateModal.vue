<template>
  <AppModal :modal="modal.settings" :errors="validationErrors">

    <template #close>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
        @click="reset()"
      ></button>
    </template>
    
    <div class="row bg-light border rounded m-0 pt-3 pb-0 px-2">
      <div class="col-12">
        <h4 class="border-bottom mb-3 pb-3">Nazwa</h4>
      </div>
      <div class="col-12 mb-3">
        <select
          class="form-select"
          autocomplete="off"
          v-model="selectedService"
          @change="getService(selectedService)"
        >
          <option value="0">Wybierz</option>
          <option v-for="service in services" :key="service.id" :value="service.id">
            {{ service.name }}
          </option>
        </select>
      </div>
    </div>
    <hr v-if="parameters.length > 0">
    <div
      class="row bg-light border rounded m-0 pt-3 pb-0 px-2"
      v-if="parameters.length > 0"
    >
      <div class="col-12">
        <h4 class="border-bottom mb-3 pb-3">Parametry</h4>
      </div>
      <div class="col-12 mb-3" v-for="parameter in parameters">
        <label class="form-label">{{ parameter.name }}</label>
        <input type="text" class="form-control" placeholder="Wpisz wartość" />
      </div>
    </div>

    <template #buttons>
      <button
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
        @click="reset()"
      >
        Zamknij
      </button>
      <button
        type="submit"
        :class="'btn btn-' + modal.settings.color"
        :disabled="modal.btnLock"
        @click="updateService()"
      >
        {{ modal.btnText }}
      </button>
    </template>

    <template #error>
      <AppErrorItems :errors="validationErrors" />
    </template>
  </AppModal>
</template>
  
<script setup lang="ts">
import { ref, watch } from "vue"
import Swal from "sweetalert2"
import { Modal } from "bootstrap"
import AppModal, { type IModal } from "@/components/AppModal.vue"

import { container } from "tsyringe"
import type { IOrderViewService } from "@/modules/service/api/services/order/OrderViewService"

import type { IServiceService } from "@/modules/service/api/services/service/ServiceService"
import { OrderViewDeviceServiceDTO } from "@/modules/service/api/dtos/order/view/OrderViewDeviceServiceDTO"
import type { ServiceDTO } from "@/modules/service/api/dtos/service/ServiceDTO"

import { ParameterTypes } from "@/modules/service/store/enums/StoreEnums"

import ValidationError from "@/core/errors/ValidationError"
import AppErrorItems from "@/components/AppErrorItems.vue"
import type { ParameterDTO } from "@/modules/service/api/dtos/parameter/ParameterDTO"
import type { OrderViewDeviceServiceParameterDTO } from "@/modules/service/api/dtos/order/view/OrderViewDeviceServiceParameterDTO"

const props = defineProps({
  orderId: { type: Number, required: true}
})
const emits = defineEmits(['refresh'])
const modal = ref<IModal>({
  settings: {
    id: '#serviceCreateModal',
    size: 'modal-lg',
    backdrop: true,
    keyboard: true,
    title: 'Usługa',
    subtitle: 'Dodawanie usługi',
    color: 'primary'
  },
  btnLock: false,
  btnText: 'Dodaj'
})
let validationErrors = ref<{key: string, errorMessage: string}[]>([])

const orderViewService = container.resolve('IOrderViewService') as IOrderViewService
const serviceData = ref<OrderViewDeviceServiceDTO[]>([])

const serviceService = container.resolve('IServiceService') as IServiceService
const services = ref<ServiceDTO[]>([])
services.value = await serviceService.getServices()

const service = ref<OrderViewDeviceServiceDTO>(new OrderViewDeviceServiceDTO)
const parameters = ref<OrderViewDeviceServiceParameterDTO[]>([])

const selectedService = ref<number>(0)

const getService = async (serviceId: number) => {
  if (selectedService.value == 0) {
    parameters.value = []
  } else {
    service.value = await orderViewService.getOrderDeviceService(props.orderId, serviceId)
    parameters.value = service.value.parameters
  }
}

const reset = () => {
  setTimeout(() => {
    selectedService.value = 0
    parameters.value = []
  }, 500)
}

const updateService = async () => {

  try {
    modal.value.btnLock = true
    validationErrors.value = []

    await orderViewService.updateOrderDeviceParameters(
      props.orderId,
      serviceData.value
    )
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Usługi zapisane",
      timer: 1000,
      showConfirmButton: false,
      showCloseButton: false,
    }).then(() => {
      Modal.getInstance(modal.value.settings.id)?.hide()
      setTimeout(() => modal.value.btnLock = false, 1500)
      emits('refresh')
    })
  }
  catch (error: any) {
    if (error instanceof ValidationError) {
      validationErrors.value = Object.keys(error.Errors).map(key => {
        const arr = error.Errors[key] as []
        return { key,errorMessage:arr.join(',') }
      })
      modal.value.btnLock = false
      return
    }
    Swal.fire({
      title: 'Błąd serwera!',
      html: 'Sprawdź szczegółowe komunikaty lub odśwież stronę i spróbuj ponownie.',
      icon: 'error',
      showConfirmButton: true,
    }).then(() => {
      modal.value.btnLock = false
    })
  }
}

</script>