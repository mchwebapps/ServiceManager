<template>
  <!-- <div class="mb-5 pt-5 text-center text-primary" v-if="!users">
    <div class="spinner-border" role="status">
      <span class="sr-only">Wczytywanie...</span>
    </div>
  </div> -->
   <!-- v-else -->
  <div class="row">
    <div class="col-12 mt-3">
      <label class="form-label">
        <h5>
          {{ component.title }}:
          <button class="btn btn-sm btn-success ms-2" data-bs-toggle="modal" :data-bs-target="component.newDataModal">
            {{ component.btnNewText }}
          </button>
        </h5>
      </label>
      <div class="table-responsive">
        <table class="table table-hover text-center align-middle fs-6">
          <thead class="bg-primary bg-opacity-10">
            <tr>
              <th class="min-w-150px">Imię i nazwisko</th>
              <th class="min-w-125px">E-mail</th>
              <th class="min-w-125px">Telefon</th>
              <th class="min-w-125px">Moduły</th>
              <th class="min-w-70px text-center pe-2">Opcje</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>
                <i class="bi bi-star-fill text-warning me-1" v-if="organizationId === user.id"></i>
                {{ user.firstName }} {{ user.lastName }}
              </td>
              <td>{{ user.email || "-" }}</td>
              <td>{{ user.phone || "-" }}</td>
              <td>-</td>
              <td class="text-center">
                <button class="btn btn-sm btn-warning" data-bs-toggle="modal" :data-bs-target="component.editDataModal"
                  @click="getUser(user)"
                >
                  Edytuj
                </button>
                <button class="btn btn-sm btn-danger mt-2 mt-md-0 ms-md-2"
                  @click="deleteOrganizationUser(user.id)"
                  v-if="organizationId !== user.id"
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
  <CreateUserModal
    :modalId="component.newDataModal"
    :organizationId="organizationId"
    @update="updateUserRoles"
    @refresh="refreshUsers()"
  />
  <SetUserRolesModal :modalId="component.editDataModal" :user="userData" />
  <SetUserRolesModal :modalId="component.updateDataModal" :user="userData" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue"
import Swal from "sweetalert2"
import { Modal } from "bootstrap"

import { OrganizationUserDTO } from "@/modules/subscription/api/dtos/OrganizationUserDTO"

import SetUserRolesModal from "@/modules/subscription/components/modals/organization/users/SetUserRolesModal.vue"
import CreateUserModal from "@/modules/subscription/components/modals/organization/users/CreateUserModal.vue"

import { container } from "tsyringe"
import type { IOrganizationUserService } from "@/modules/subscription/api/services/OrganizationUserService"

const props = defineProps({
  organizationId: { type: String, required: true },
  organizationUsers: { type: [OrganizationUserDTO] },
  usersRefresh: { type: Boolean }
})
const emits = defineEmits(['delete-user-success', 'delete-user-error'])
const component = ref({
  title: 'Użytkownicy organizacji',
  btnEditText: 'Edytuj',
  btnNewText: 'Dodaj',
  newDataModal: '#UserCreateModal',
  editDataModal: '#SetUserRolesModal',
  updateDataModal: '#SetUserModalIdAfterCreate'
})

const organizationUserService = container.resolve('IOrganizationUserService') as IOrganizationUserService
const users = ref<OrganizationUserDTO[]>([])
const userData = ref<OrganizationUserDTO>(new OrganizationUserDTO())

let isEditingOrganizationContacts = ref<boolean>(false)
let isCreatingOrganizationContact = ref<boolean>(false)
let usersRefresh = ref<boolean>(false)

const refreshUsers = async () => {
  const refreshedUsers = await organizationUserService.getOrganizationUsers(props.organizationId)
  users.value = refreshedUsers
}

const getUser = (user: OrganizationUserDTO) => {
  userData.value = user
}

const onCreateOrganizationUserSuccess = (userId: string) => {
  usersRefresh.value = !usersRefresh.value
  userId = userId
}
const updateUserRoles = async (userId: any) => {
  const createdUser = await organizationUserService.getOrganizationUser(userId)
  userData.value = createdUser

  const el = document.querySelector(component.value.updateDataModal)
  const modal = new Modal(el as Element)
  modal.show()
}

const getOrganizationUser = async (userId: string) => {
  userData.value = await organizationUserService.getOrganizationUser(userId)
}
const deleteOrganizationUser = (userId: string) => {
  try {
    Swal.fire({
      icon: 'question',
      html: 'Czy na pewno chcesz usunąć tego użytkownika?',
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
          await organizationUserService.deleteOrganizationUser(userId)
          // emits('delete-user-success')

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Użytkownik usunięty',
            timer: 1000,
            showConfirmButton: false,
            showCloseButton: false
          }).then(() => {
            refreshUsers()
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
      showConfirmButton: true
    }).then(() => {
      emits("delete-user-error")
      console.log(error)
    })
  }
}

watch(
  () => props.organizationId,
  async (newId) => {
    users.value = await organizationUserService.getOrganizationUsers(newId as string)
  }
)

watch(
  () => props.usersRefresh,
  async () => {
    users.value = await organizationUserService.getOrganizationUsers(props.organizationId as string)
    emits("delete-user-success")
  },
  { deep: true }
)

onMounted(async () => {
  if (props.organizationId) {
    users.value = await organizationUserService.getOrganizationUsers(props.organizationId)
  }
})


</script>
