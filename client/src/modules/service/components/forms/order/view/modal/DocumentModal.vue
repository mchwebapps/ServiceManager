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
              name="document"
              id="document-1"
              value="1"
              v-model="document"
            >
            <label
              class="form-check-label stretched-link"
              for="document-1"
              role="button"
            >
              Dokument dla klienta
            </label>
          </li>
          <li class="list-group-item d-flex">
            <input
              type="radio"
              class="form-check-input me-3"
              name="document"
              id="document-2"
              value="2"
              v-model="document"
            >
            <label
              class="form-check-label stretched-link"
              for="document-2"
              role="button"
            >
              Naklejka serwisowa
            </label>
          </li>
          <li class="list-group-item d-flex">
            <input
              type="radio"
              class="form-check-input me-3"
              name="document"
              id="document-3"
              value="3"
              v-model="document"
            >
            <label
              class="form-check-label stretched-link"
              for="document-3"
              role="button"
            >
              Naklejka sprzedażowa
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
        @click="printDocument()"
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
// import { container } from "tsyringe"
// import type { IOrderViewService } from "@/modules/service/api/services/order/OrderViewService"
import ValidationError from "@/core/errors/ValidationError"
import AppErrorItems from "@/components/AppErrorItems.vue"

const props = defineProps({
  orderId: { type: Number, required: true }
})
const emits = defineEmits(['refresh'])
const modal = ref<IModal>({
  settings: {
    id: '#documentModal',
    size: '',
    backdrop: false,
    keyboard: false,
    title: 'Dokument do wydruku',
    subtitle: '',
    color: 'primary'
  },
  btnLock: false,
  btnText: 'Drukuj'
})
let validationErrors = ref<{key: string, errorMessage: string}[]>([])
const document = ref(1)

const printDocument = async () => {

  try {
    modal.value.btnLock = true
    validationErrors.value = []

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Wydruk dokumentu...",
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