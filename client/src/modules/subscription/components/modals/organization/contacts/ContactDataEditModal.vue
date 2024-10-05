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

    <div class="container-fluid">
      <div class="row">
        <div class="col-12 col-md-6 mb-3">
          <label for="firstName" class="form-label">Imię:</label>
          <input type="text" class="form-control form-control-sm" id="firstName" placeholder="Wpisz imię"  autocomplete="off" v-model="contactData.firstName">
        </div>
        <div class="col-12 col-md-6 mb-3">
          <label for="lastName" class="form-label">Nazwisko:</label>
          <input type="text" class="form-control form-control-sm" id="lastName" placeholder="Wpisz nazwisko" autocomplete="off" v-model="contactData.lastName">
        </div>
        <div class="col-12 col-md-6 mb-3">
          <label for="phone" class="form-label">Nr telefonu:</label>
          <input type="text" class="form-control form-control-sm" id="phone" placeholder="Wpisz numer telefonu" autocomplete="off" v-model="contactData.phone">
        </div>
        <div class="col-12 col-md-6 mb-3">
          <label for="email" class="form-label">E-Mail:</label>
          <input type="text" class="form-control form-control-sm" id="email" placeholder="Wpisz adres mailowy" autocomplete="off" v-model="contactData.email">
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
        @click="updateContact()"
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
import { OrganizationContactDTO } from "@/modules/subscription/api/dtos/OrganizationContactDTO"
import { container } from "tsyringe"
import type { IOrganizationContactService } from "@/modules/subscription/api/services/OrganizationContactService"
import AppErrorItems from "@/components/AppErrorItems.vue"
import ValidationError from "@/core/errors/ValidationError"

// import { ErrorMessage, Field, Form } from "vee-validate"

const props = defineProps({
  organizationId: { type: String, required: true },
  contact: { type: OrganizationContactDTO, required: true }
})
const emits = defineEmits(['refresh'])

const modal = ref<IModal>({
  settings: {
    id: '#ContactDataEditModal',
    size: '',
    backdrop: true,
    keyboard: true,
    title: 'Dane kontaktowe',
    subtitle: 'Edycja danych',
    color: 'warning'
  },
  btnText: 'Zapisz',
  btnLock: false
})

const organizationContactService = container.resolve('IOrganizationContactService') as IOrganizationContactService
const contactData = ref<OrganizationContactDTO>(new OrganizationContactDTO())

watch(
  () => props.contact,
  () => { contactData.value = {...props.contact} },
  { deep: true }
)

let validationErrors = ref<{ key: string, errorMessage: string }[]>([])

const updateContact = async () => {
  try {
    modal.value.btnLock = true
    validationErrors.value = []

    await organizationContactService.updateContact(props.organizationId, contactData.value)

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Dane zapisane',
      timer: 1000,
      showConfirmButton: false,
      showCloseButton: false,
    }).then(() => {
      Modal.getInstance(modal.value.settings.id)?.hide()
      setTimeout(() => { modal.value.btnLock = false }, 1500)
      emits('refresh')
    })
  } catch (error: any) {
      if (error instanceof ValidationError) {
        validationErrors.value = Object.keys(error.Errors).map(key => {
          const arr = error.Errors[key] as []
          console.log({ key, errorMessage:arr.join(',') })
          return { key, errorMessage:arr.join(',') }
        })
        modal.value.btnLock = false
        return
      }
      Swal.fire({
        title: 'Błąd serwera!',
        html: 'Poczekaj chwilę lub odśwież stronę i spróbuj ponownie.',
        icon: 'error',
        showConfirmButton: true,
      }).then(() => {
        modal.value.btnLock = false
      })
    }
}
</script>