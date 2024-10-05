<template>
  <div class="row">
    <div class="col-12 mt-3">
      <label class="form-label">
        <h5>
          {{ component.title }}:
          <button class="btn btn-sm btn-success ms-2" data-bs-toggle="modal" :data-bs-target="component.newDataModal">
            {{ component.btnNewText }}
          </button>
          <!-- <button
            type="button"
            class="btn btn-sm btn-warning ms-auto mt-1 mb-1"
            title="Edytuj dane"
            @click="editOrganizationContacts()"
          >
            <i class="bi bi-pen fs-4"></i>
            Edytuj
          </button>
          <button
            type="button"
            class="btn btn-sm btn-success ms-2 mt-1 me-1 mb-1"
            title="Dodaj kontakt"
            @click="createOrganizationContact()"
          >
            <i class="bi bi-person-plus fs-3"></i>
            Dodaj
          </button> -->
        </h5>
      </label>
      <div
        class="d-flex flex-row flex-wrap justify-content-start pt-3 pb-3 ps-5"
        v-if="contacts.length == 0"
      >
        Brak kontaktów.
      </div>
      <div class="table-responsive" v-else>
        <table class="table table-borderless align-middle">
          <tbody>
            <tr v-for="contact in contacts" :key="contact.id">
              <td class="w-5">
                <input type="radio" class="form-check-input" :id="'contactDetails-' + contact.id" autocomplete="off"
                  role="button" :value="contact.id" v-model="checkedContacts" :checked="contact.defaultContact">
              </td>
              <td>
                <label :for="'contactDetails-' + contact.id" role="button">
                  <b>{{ contact.firstName }} {{ contact.lastName }}</b>
                  <span class="d-block d-md-inline">
                    <i class="bi bi-telephone ms-0 ms-md-4 me-0" v-if="contact.phone"></i> {{ contact.phone }}
                  </span>
                  <span class="d-block d-md-inline">
                    <i class="bi bi-envelope ms-0 ms-md-4 me-1" v-if="contact.email"></i> {{ contact.email }}
                  </span>
                </label>
              </td>
              <td class="w-20 text-center text-md-end">
                <button class="btn btn-sm btn-warning" data-bs-toggle="modal" :data-bs-target="component.editDataModal"
                  @click="editContact(contact)"
                >
                  Edytuj
                </button>
                <button class="btn btn-sm btn-danger mt-2 mt-md-0 ms-md-2"
                  @click="deleteContact(contact.id)"
                >
                  Usuń
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <hr>
  <ContactDataCreateModal :organizationId="organizationId" @refresh="refreshContacts()" />
  <ContactDataEditModal :organizationId="organizationId" :contact="contactData" @refresh="refreshContacts()" />
 </template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue"
import Swal from "sweetalert2"
import { OrganizationContactDTO } from "@/modules/subscription/api/dtos/OrganizationContactDTO"
import { container } from "tsyringe"
import type { IOrganizationContactService } from "@/modules/subscription/api/services/OrganizationContactService"
import ContactDataCreateModal from "@/modules/subscription/components/modals/organization/contacts/ContactDataCreateModal.vue"
import ContactDataEditModal from "@/modules/subscription/components/modals/organization/contacts/ContactDataEditModal.vue"

const props = defineProps({
  'organizationId': { type: String, required: true },
  'contactsRefresh': { type: Boolean }
})

const emits = defineEmits([
  'create-contact-success'
])

const component = ref({
  title: 'Dane kontaktowe',
  btnEditText: 'Edytuj',
  btnNewText: 'Dodaj',
  newDataModal: '#ContactDataCreateModal',
  editDataModal: '#ContactDataEditModal'
})

const contactService = container.resolve('IOrganizationContactService') as IOrganizationContactService
const contacts = ref<OrganizationContactDTO[]>([])
const contactData = ref<OrganizationContactDTO>(new OrganizationContactDTO())

const checkedContacts = ref([])

const refreshContacts = async () => {
  const refreshedContacts = await contactService.getContacts(props.organizationId)
  contacts.value = refreshedContacts
}

const editContact = (contact: OrganizationContactDTO) => {
  contactData.value = contact
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
          await contactService.deleteContact(props.organizationId, contactId)

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Dane usunięte',
            timer: 1000,
            showConfirmButton: false,
            showCloseButton: false,
          }).then(() => {
            refreshContacts()
          })
        }
      }
    )
  }
  catch (error) {
    Swal.fire({
      title: 'Wystąpił błąd!',
      text: 'Spróbuj ponownie za chwilę.',
      icon: 'error',
      showConfirmButton: true,
    }).then(() => {
      console.log(error)
    })
  }
}

watch(
  () => props.organizationId,
  async (newId) => {
    contacts.value = await contactService.getContacts(newId)
  },
  { deep: true }
)
watch(
  () => props.contactsRefresh,
  async () => {
    contacts.value = await contactService.getContacts(props.organizationId)
    emits('create-contact-success')
  },
  { deep: true }
)

onMounted(() => {
  if (props.organizationId) {
    contactService.getContacts(props.organizationId).then(c => contacts.value = c)
  }
})
</script>
