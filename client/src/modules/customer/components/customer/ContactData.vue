<template>
  <div class="row">
    <div class="col-12 mt-3">
      <label class="form-label">
        <h5>
          {{ component.title }}:
          <button class="btn btn-sm btn-success ms-2" data-bs-toggle="modal" :data-bs-target="component.newDataModal">
            {{ component.btnValue }}
          </button>
        </h5>
      </label>
      <div class="table-responsive">
        <table class="table table-borderless align-middle">
          <tbody>
            <tr v-for="contact in contacts" :key="contact.id">
              <td class="w-5">
                <input
                  type="radio"
                  class="form-check-input"
                  :id="'mainContact' + contact.id"
                  name="mainContact"
                  autocomplete="off"
                  role="button"
                  :checked="contact.isMain"
                  @click="setContact(contact.id)"
                >
              </td>
              <td>
                <label :for="'mainContact' + contact.id" role="button">
                  <!-- <b>{{ contact.firstName }} {{ contact.lastName }}</b> - {{ contact.phoneNumber }} - {{ contact.email }} -->
                  <b>{{ contact.firstName }} {{ contact.lastName }}</b>
                  <span class="d-block d-md-inline" v-if="contact.phoneNumber">
                    <i class="bi bi-telephone ms-0 ms-md-4 me-0"></i> {{ contact.phoneNumber }}
                  </span>
                  <span class="d-block d-md-inline" v-if="contact.email">
                    <i class="bi bi-envelope ms-0 ms-md-4 me-1"></i> {{ contact.email }}
                  </span>
                </label>
              </td>
              <td class="w-20 text-center text-md-end">
                <button class="btn btn-sm btn-warning" data-bs-toggle="modal" :data-bs-target="component.editDataModal"
                  @click="editContact(contact.id)">
                  Edytuj
                </button>
                <button class="btn btn-sm btn-danger mt-2 mt-md-0 ms-md-2"
                  @click="deleteContact(contact.id)">Usuń</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <ContactDataCreateModal :customerId="customerId" @refresh="refreshContacts()" />
  <ContactDataEditModal :customerId="customerId" :contact="contact" @refresh="refreshContacts()" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Swal from 'sweetalert2'
import { CommonCustomerContactDTO } from '@/core/dtos/customer/CommonCustomerContactDTO'
import { container } from 'tsyringe'
import type { ICommonCustomerContactService } from '@/core/services/customer/CommonCustomerContactService'
import ContactDataCreateModal from '@/components/modals/customer/ContactDataCreateModal.vue'
import ContactDataEditModal from '@/components/modals/customer/ContactDataEditModal.vue'
import ValidationError from '@/core/errors/ValidationError'

const props = defineProps({
  customerId: { type: String, required: true }
})
const component = ref({
  title: 'Dane kontaktowe',
  btnValue: 'Dodaj',
  newDataModal: '#ContactDataCreateModal',
  editDataModal: '#ContactDataEditModal'
})
let validationErrors = ref<{key: string, errorMessage: string}[]>([])

const contactService = container.resolve('ICommonCustomerContactService') as ICommonCustomerContactService

const contacts = ref<CommonCustomerContactDTO[]>([])
const contact = ref<CommonCustomerContactDTO>(new CommonCustomerContactDTO)

contacts.value = await contactService.getCustomerContacts(props.customerId)


const refreshContacts = async () => {
  contacts.value = await contactService.getCustomerContacts(props.customerId)
}


const editContact = async (contactId: number) => {
  contact.value = await contactService.getCustomerContact(props.customerId, contactId)
}


const setContact = async (contactId: number, data: boolean = true) => {
  try {
    await contactService.setCustomerContact(
    props.customerId,
    contactId,
    data
  )
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: "Dane ustawione",
    timer: 1000,
    showConfirmButton: false,
    showCloseButton: false,
  })
} catch (error: any) {
    if (error instanceof ValidationError) {
      validationErrors.value = Object.keys(error.Errors).map(key => {
        const arr = error.Errors[key] as []
        return { key,errorMessage:arr.join(',') }
      })
      return
    }
    Swal.fire({
      title: 'Błąd serwera!',
      html: 'Sprawdź szczegółowe komunikaty lub odśwież stronę i spróbuj ponownie.',
      icon: 'error',
      showConfirmButton: true,
    })
  }
}


const deleteContact = (contactId: number) => {
  try {
    Swal.fire({
      icon: 'question',
      html: 'Czy na pewno chcesz usunąć te dane?',
      showCancelButton: true,
      cancelButtonText: 'Nie',
      cancelButtonColor: '#adb5bd', 
      showConfirmButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Tak',
      reverseButtons: true
    })
    .then(
      async (result) => {
        if (result.isConfirmed) {
          await contactService.deleteCustomerContact(props.customerId, contactId)

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Dane usunięte',
            timer: 1500,
            showConfirmButton: false,
            showCloseButton: false,
          })
          refreshContacts()
        }
      }
    )
  } catch (error: any) {
      if (error instanceof ValidationError) {
        validationErrors.value = Object.keys(error.Errors).map(key => {
          const arr = error.Errors[key] as []
          return { key,errorMessage:arr.join(',') }
        })
        return
      }
      Swal.fire({
        title: 'Błąd serwera!',
        html: 'Sprawdź szczegółowe komunikaty lub odśwież stronę i spróbuj ponownie.',
        icon: 'error',
        showConfirmButton: true,
      })
    }
}
</script>
