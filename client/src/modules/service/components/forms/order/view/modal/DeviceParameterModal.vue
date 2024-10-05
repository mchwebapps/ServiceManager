<template>
<AppModal :modal="modal.settings" :errors="validationErrors">

    <template #close>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
      ></button>
    </template>

    <div class="row">
      <div
        class="col-12"
        :class="{ 'col-lg-6': parameter.type !== ParameterTypes.TextArea }"
        v-for="parameter in parameters"
        :key="parameter.id"
      >
        <div class="mb-3" v-if="parameter.type == ParameterTypes.SingularSelection">
          <label class="form-label">{{ parameter.name }}:</label>
          <select class="form-select" autocomplete="off" v-model="parameter.value">
            <option
              v-for="value in parameter.values"
              :key="value.id"
              :value="value.id"
            >
              {{ value.text }}
            </option>
          </select>
        </div>
        <div class="mb-3" v-if="parameter.type == ParameterTypes.TextInput">
          <label class="form-label">{{ parameter.name }}:</label>
          <input class="form-control" autocomplete="off" v-model="parameter.value">
        </div>
        <div class="mb-3" v-if="parameter.type == ParameterTypes.Special">
          <label class="form-label">{{ parameter.name }}:</label>
          <input class="form-control" autocomplete="off" v-model="parameter.value">
        </div>
        <div class="mb-3" v-if="parameter.type == ParameterTypes.TextArea">
          <label class="form-label">{{ parameter.name }}:</label>
          <textarea class="form-control" rows="1" autocomplete="off" v-model="(parameter.value as string)"></textarea>
        </div>
      </div>
    </div>

    <template #buttons>
      <button
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
      >
        Zamknij
      </button>
      <button
        type="submit"
        :class="'btn btn-' + modal.settings.color"
        :disabled="modal.btnLock"
        @click="updateParameters()"
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
import type { OrderViewDeviceParameterDTO } from "@/modules/service/api/dtos/order/view/OrderViewDeviceParameterDTO"
import { ParameterTypes } from "@/modules/service/store/enums/StoreEnums"
import ValidationError from "@/core/errors/ValidationError"
import AppErrorItems from "@/components/AppErrorItems.vue"

const props = defineProps({
  orderId: { type: Number, required: true},
  parameters: { type: Array<OrderViewDeviceParameterDTO>, required: true }
})
const emits = defineEmits(['refresh'])
const modal = ref<IModal>({
  settings: {
    id: '#parameterModal',
    size: 'modal-lg',
    backdrop: true,
    keyboard: true,
    title: 'Urządzenie',
    subtitle: 'Edycja danych',
    color: 'warning'
  },
  btnLock: false,
  btnText: 'Zapisz'
})
let validationErrors = ref<{key: string, errorMessage: string}[]>([])

const orderViewService = container.resolve('IOrderViewService') as IOrderViewService
const parameterData = ref<OrderViewDeviceParameterDTO[]>([])

  watch(
  () => props.parameters,
  () => { parameterData.value = {...props.parameters} },
  { deep: true }
)

const updateParameters = async () => {

  try {
    modal.value.btnLock = true
    validationErrors.value = []

    await orderViewService.updateOrderDeviceParameters(
      props.orderId,
      parameterData.value
    )
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Parametry zapisane",
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