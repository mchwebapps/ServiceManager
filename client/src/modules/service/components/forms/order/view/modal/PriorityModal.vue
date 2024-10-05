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
        <ul class="list-group">
          <li class="list-group-item d-inline-flex">
            <input
              type="radio"
              class="form-check-input me-3"
              name="priority"
              id="priority-1"
              value="Na spokojnie"
              v-model="priority"
            >
            <label
              class="form-check-label text-success stretched-link"
              for="priority-1"
              role="button"
            >
              Na spokojnie
            </label>
          </li>
          <li class="list-group-item d-flex">
            <input
              type="radio"
              class="form-check-input me-3"
              name="priority"
              id="priority-2"
              value="Na dziś"
              v-model="priority"
            >
            <label
              class="form-check-label text-warning stretched-link"
              for="priority-2"
              role="button"
            >
              Na dziś
            </label>
          </li>
          <li class="list-group-item d-flex">
            <input
              type="radio"
              class="form-check-input me-3"
              name="priority"
              id="priority-3"
              value="Na wczoraj"
              v-model="priority"
            >
            <label
              class="form-check-label text-danger stretched-link"
              for="priority-3"
              role="button"
            >
              Na wczoraj
            </label>
          </li>
        </ul>
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
        @click="setPriority()"
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
  priority: { type: String, required: true }
})
const emits = defineEmits(['refresh'])
const modal = ref<IModal>({
  settings: {
    id: '#priorityModal',
    size: '',
    backdrop: true,
    keyboard: true,
    title: 'Priorytet',
    subtitle: 'Edycja danych',
    color: 'warning'
  },
  btnLock: false,
  btnText: 'Zapisz'
})
let validationErrors = ref<{key: string, errorMessage: string}[]>([])

const orderViewService = container.resolve('IOrderViewService') as IOrderViewService

const setPriority = async () => {

  try {
    modal.value.btnLock = true
    validationErrors.value = []

    await orderViewService.setOrderPriority(props.orderId, props.priority)

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Priorytet zapisany",
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