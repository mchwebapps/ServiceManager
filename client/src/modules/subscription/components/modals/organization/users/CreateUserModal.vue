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
        <div class="col-12 col-md-6 mb-3">
          <label for="firstName" class="form-label">Imię:</label>
          <input type="text" class="form-control form-control-sm" id="firstName" placeholder="Wpisz imię"
            autocomplete="off" v-model="organizationUser.firstName">
        </div>
        <div class="col-12 col-md-6 mb-3">
          <label for="lastName" class="form-label">Nazwisko:</label>
          <input type="text" class="form-control form-control-sm" id="lastName" placeholder="Wpisz nazwisko"
            autocomplete="off" v-model="organizationUser.lastName">
        </div>
        <div class="col-12 mb-3">
          <label for="lastName" class="form-label">Nazwa użytkownika:</label>
          <input type="text" class="form-control form-control-sm" id="lastName" placeholder="Wpisz nazwisko"
            autocomplete="off" v-model="organizationUser.username">
        </div>
        <div class="col-12 col-md-6 mb-3">
          <label for="phone" class="form-label">Nr telefonu:</label>
          <input type="text" class="form-control form-control-sm" id="phone" placeholder="Wpisz numer telefonu"
            autocomplete="off" v-model="organizationUser.phone">
        </div>
        <div class="col-12 col-md-6 mb-3">
          <label for="email" class="form-label">E-Mail:</label>
          <input type="text" class="form-control form-control-sm" id="email" placeholder="Wpisz adres mailowy"
            autocomplete="off" v-model="organizationUser.email">
        </div>
      </div>
      <div
        class="alert bg-light-warning border border-warning d-flex flex-column flex-sm-row align-items-center w-100 p-5 my-10">
        <i class="bi bi-info-circle text-warning fs-3 d-none d-sm-inline me-4"></i>

        <div class="d-flex flex-column text-center text-sm-start pe-0 pe-sm-10">
          <h5 class="mb-1">
            Hasło do pierwszego logowania:
            <span class="text-danger d-block d-sm-inline ms-1" v-html="organizationUser.username"></span>
          </h5>
          <span> Po pierwszym zalogowaniu nastąpi zmiana hasła. </span>
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
      <button type="submit" :class="'btn btn-' + modal.settings.color" :disabled="modal.btnLock"
        @click="createOrganizationUser()">
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
import { OrganizationUserDTO } from "@/modules/subscription/api/dtos/OrganizationUserDTO"
import { container } from "tsyringe"
import type { IOrganizationUserService } from "@/modules/subscription/api/services/OrganizationUserService"
import AppErrorItems from "@/components/AppErrorItems.vue"
import ValidationError from "@/core/errors/ValidationError"

// import { ErrorMessage, Field, Form } from "vee-validate"

const props = defineProps({
  modalId: { type: String, required: true },
  organizationId: { type: String, required: true }
})
const emits = defineEmits(['update', 'refresh'])
const modal = ref<IModal>({
  settings: {
    id: props.modalId,
    size: '',
    backdrop: true,
    keyboard: true,
    title: 'Zarządzanie organizacją',
    subtitle: 'Nowy użytkownik',
    color: 'success'
  },
  btnText: 'Dodaj',
  btnLock: false
})

const organizationUserService = container.resolve('IOrganizationUserService') as IOrganizationUserService
const organizationUser = ref(new OrganizationUserDTO())

const validationSchema = {
  // firstName: 'required|alpha|min:3|max:32',
  // lastName: 'required|alpha|min:3|max:32',
  // username: 'required|alpha_num|min:8|max:32',
  // email: 'email|max:64',
  // phone: 'numeric|min:9',
}
let validationErrors = ref<{key:string,errorMessage:string}[]>([])


const reset = () => {
  setTimeout(() => {
    organizationUser.value = new OrganizationUserDTO
  }, 500)
}

const createOrganizationUser = async () => {
  try {
    modal.value.btnLock = true
    validationErrors.value = []

    const userId = await organizationUserService.createOrganizationUser(
      props.organizationId,
      organizationUser.value as OrganizationUserDTO
    )

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Użytkownik utworzony',
      timer: 1000,
      showConfirmButton: false,
      showCloseButton: false,
    }).then(() => {
      Modal.getInstance(modal.value.settings.id)?.hide()
      setTimeout(() => {
        modal.value.btnLock = false
        organizationUser.value = new OrganizationUserDTO()
      }, 1500)
      emits('update', userId)
      emits('refresh')
      emits('refresh')
    })
  } catch (error: any) {
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
