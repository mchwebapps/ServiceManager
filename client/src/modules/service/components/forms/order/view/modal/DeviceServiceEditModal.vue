<template>
  <AppModal :modal="modal.settings" :errors="validationErrors">
    <template #close>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
        @click="$emit('set', serviceId)"
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
          v-model="serviceId"
          @change="getService(serviceId)"
        >
          <!-- <option value="0">Wybierz</option> -->
          <option v-for="service in services" :key="service.id" :value="service.id">
            {{ service.name }}
          </option>
        </select>
      </div>
    </div>
    <hr>
    <div
      class="row bg-light border rounded m-0 pt-3 pb-0 px-2"
      
    >
      <div class="col-12">
        <h4 class="border-bottom mb-3 pb-3">Parametry</h4>
      </div>
      <div class="col-12 mb-3" v-for="parameter in service.parameters">
        <label class="form-label">{{ parameter.name }}</label>
        <input type="text" class="form-control" placeholder="Wpisz wartość" />
      </div>
    </div>

    <template #buttons>
      <button
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
        @click="$emit('set', serviceId)"
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
import { OrderViewDTO } from "@/modules/service/api/dtos/order/view/OrderViewDTO"
import { OrderViewDeviceServiceDTO } from "@/modules/service/api/dtos/order/view/OrderViewDeviceServiceDTO"
import type { OrderViewDeviceServiceParameterDTO } from "@/modules/service/api/dtos/order/view/OrderViewDeviceServiceParameterDTO"

import type { IServiceService } from "@/modules/service/api/services/service/ServiceService"
import type { ServiceDTO } from "@/modules/service/api/dtos/service/ServiceDTO"

import { ParameterTypes } from "@/modules/service/store/enums/StoreEnums"
import type { ParameterDTO } from "@/modules/service/api/dtos/parameter/ParameterDTO"

import ValidationError from "@/core/errors/ValidationError"
import AppErrorItems from "@/components/AppErrorItems.vue"

const props = defineProps({
  orderId: { type: Number, required: true},
  serviceId: { type: Number, required: true }
})

const emits = defineEmits(['refresh', 'set'])
const modal = ref<IModal>({
  settings: {
    id: '#serviceEditModal',
    size: 'modal-lg',
    backdrop: true,
    keyboard: true,
    title: 'Usługa',
    subtitle: 'Edycja danych',
    color: 'warning'
  },
  btnLock: false,
  btnText: 'Zapisz'
})
let validationErrors = ref<{key: string, errorMessage: string}[]>([])

const orderViewService = container.resolve('IOrderViewService') as IOrderViewService
const service = ref<OrderViewDeviceServiceDTO>(new OrderViewDeviceServiceDTO)

const serviceService = container.resolve('IServiceService') as IServiceService
const services = ref<ServiceDTO[]>([])
services.value = await serviceService.getServices()

// const selectedService = ref(props.serviceId)

watch(
  () => props.serviceId,
  async () => {
    service.value = await orderViewService.getOrderDeviceService(props.orderId, props.serviceId)
    // selectedService.value = newId
  },
  { deep: true }
)

const getService = async (serviceId: number) => {
  service.value = await orderViewService.getOrderDeviceService(props.orderId, serviceId)
}

// watch(
//   () => selectedService.value,
//   async (newId) => {
//     service.value = await orderViewService.getOrderDeviceService(props.orderId, newId)
//   }
// )

const updateService = async () => {

  try {
    modal.value.btnLock = true
    validationErrors.value = []

    await orderViewService.updateOrderDeviceParameters(
      props.orderId,
      service.value.parameters
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