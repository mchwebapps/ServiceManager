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

    <div class="container-fluid">
      <div class="row">
        <div class="col-12 col-lg-6 mb-3">
          <label for="firstName" class="form-label">Imię:</label>
          <input type="text" class="form-control" id="firstName" placeholder="Wpisz imię" v-model="contact.firstName">
        </div>
        <div class="col-12 col-lg-6 mb-3">
          <label for="lastName" class="form-label">Nazwisko:</label>
          <input type="text" class="form-control" id="lastName" placeholder="Wpisz nazwisko" v-model="contact.lastName">
        </div>
        <div class="col-12 col-lg-6 mb-3">
          <label for="phone" class="form-label">Nr telefonu:</label>
          <input type="text" class="form-control" id="phone" placeholder="Wpisz numer telefonu" v-model="contact.phoneNumber">
        </div>
        <div class="col-12 col-lg-6 mb-3">
          <label for="email" class="form-label">E-Mail:</label>
          <input type="text" class="form-control" id="email" placeholder="Wpisz adres mailowy" v-model="contact.email">
        </div>
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
        @click="createContact()"
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
import { CommonCustomerContactDTO } from "@/core/dtos/customer/CommonCustomerContactDTO"
import { container } from "tsyringe"
import type { ICommonCustomerContactService } from "@/core/services/customer/CommonCustomerContactService"
import AppErrorItems from "@/components/AppErrorItems.vue"
import ValidationError from "@/core/errors/ValidationError"

const props = defineProps({
  customerId: { type: String, required: true}
})
const emits = defineEmits(['refresh'])
const modal = ref<IModal>({
  settings: {
    id: '#ContactDataCreateModal',
    size: 'modal-lg',
    backdrop: true,
    keyboard: true,
    title: 'Dane kontaktowe',
    subtitle: 'Nowe dane',
    color: 'success'
  },
  btnText: 'Dodaj',
  btnLock: false
})
let validationErrors = ref<{key: string, errorMessage: string}[]>([])

const contactService = container.resolve('ICommonCustomerContactService') as ICommonCustomerContactService
const contact = ref<CommonCustomerContactDTO>(new CommonCustomerContactDTO)

const reset = () => {
  setTimeout(() => {
    contact.value = new CommonCustomerContactDTO
  }, 500)
}

const createContact = async () => {

  try {
    modal.value.btnLock = true
    validationErrors.value = []

    await contactService.createCustomerContact(
      props.customerId,
      contact.value
    )
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Dane utworzone",
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