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
      <div class="col">
        <div class="mb-3">
          <div class="input-group input-group-sm mb-3">
            <input
              type="date"
              class="form-control form-control-sm"
              autocomplete="off"
              v-model="modelValue"
            >
            <span class="input-group-text">
              <i class="bi bi-calendar"></i>
            </span>
          </div>
        </div>
      </div>
    </div>

    <template #buttons>
      <button
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
        @click="emits('update:modelValue', modelValue)"
      >
        Zamknij
      </button>
      <button
        type="submit"
        :class="'btn btn-' + modal.settings.color"
        :disabled="modal.btnLock"
        @click="setDeadline()"
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
import { ref } from "vue"
import Swal from "sweetalert2"
import { Modal } from "bootstrap"
import AppModal, { type IModal } from "@/components/AppModal.vue"
import { container } from "tsyringe"
import type { IOrderViewService } from "@/modules/service/api/services/order/OrderViewService"
import ValidationError from "@/core/errors/ValidationError"
import AppErrorItems from "@/components/AppErrorItems.vue"

const props = defineProps({
  orderId: { type: Number, required: true },
  modelValue: { type: String, default: ''}
})

const emits = defineEmits(['refresh', 'update:modelValue'])
const modal = ref<IModal>({
  settings: {
    id: '#deadlineModal',
    size: '',
    backdrop: true,
    keyboard: true,
    title: 'Termin realizacji',
    subtitle: 'Edycja danych',
    color: 'warning'
  },
  btnLock: false,
  btnText: 'Zapisz'
})
let validationErrors = ref<{key: string, errorMessage: string}[]>([])

const orderViewService = container.resolve('IOrderViewService') as IOrderViewService

const setDeadline = async () => {

  try {
    modal.value.btnLock = true
    validationErrors.value = []

    await orderViewService.setOrderDeadline(
      props.orderId,
      props.modelValue
    )

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Data zapisana",
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