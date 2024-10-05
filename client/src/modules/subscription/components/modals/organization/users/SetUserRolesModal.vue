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
        <div class="col-12 mb-3">
          <div class="mb-3">
            <label class="form-label mb-0">Użytkownik:</label>
            <div>
              <span class="badge text-bg-warning">{{ user?.firstName }} {{ user?.lastName }}</span>
              <span class="text-muted ms-2">{{ user?.email }}</span>
            </div>
          </div>
          <hr>
        <div class="table-responsive">
          <table class="table table-bordered text-center align-middle fs-6">
            <thead class="bg-primary bg-opacity-10">
                <tr>
                  <th class="w-25">Moduł</th>
                  <th>Rola</th>
                  <th class="w-25">Dostęp</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border" v-for="userAccess in userAccesses" :key="userAccess.moduleKey">
                  <td class="align-middle">{{ userAccess.moduleName }}</td>
                  <td class="align-middle px-5">
                    <!-- <div class="d-inline-flex w-100"> -->
                      <select
                        id="roleName"
                        name="roleName"
                        class="form-select"
                        placeholder="Rola użytkownika"
                        v-model="userAccess.activeRoleId"
                        :disabled="!userAccess.hasUserAccess"
                        @change="toggleRoleNameInfo()"
                      >
                        <!-- 
                          @change="toggleRoleNameActivity()"
                          v-model="selected"
                          :disabled="isSelectActive" v-model="roleName"
                         -->
                        <option disabled value="">
                          Wybierz rolę użytkownika
                        </option>
                        <option
                          v-for="role in userAccess.roles"
                          :key="role.id"
                          :value="role.id"
                          :selected="userAccess.activeRoleId">{{ role.name }}</option>
                      </select>
                    <!-- <i
                        class="bi cursor-pointer fs-1 ms-5 mt-5"
                        data-bs-toggle="collapse"
                        href="#role"
                        aria-expanded="false"
                        aria-controls="role"
                        :class="{ 
                          'text-primary bi-eye': isRoleNameSelected,
                          'bi-eye-slash': isRoleNameEmpty
                        }"
                        @click="collapseRoleDetails()"
                      ></i> -->
                    <!--  
                        @click="testSelect"
                        :class="{ 'text-primary': isRolesVisible }"
                      -->
                    <!-- </div> -->
                  </td>
                  <td class="align-middle">
                    <div
                      class="form-check form-switch form-check-custom form-check-solid d-flex justify-content-center"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="userAccess.hasUserAccess"
                        id="flexSwitchDefault"
                        @change="toggleRoleNameActivity()"
                      />
                      <!-- 
                        <label class="form-check-label" for="flexSwitchDefault"></label>
                        @change="isActive" :checked="isAccessActive"
                      -->
                    </div>
                  </td>
                </tr>
                <tr v-if="isRoleDetailsVisible">
                  <td colspan="3">
                    <div class="container-fluid">
                      <div class="row mt-3 mx-0 mb-0">
                        <div class="col-12 mb-3">
                          <h4 class="text-bg-primary bg-opacity-50 py-2 rounded-top">
                            Rola 1
                          </h4>
                          <div class="bg-light p-5 rounded-bottom">
                            <div
                              class="form-check form-check-custom form-check-sm text-start"
                            >
                              <input
                                type="checkbox"
                                id="checkbox"
                                class="form-check-input me-2"
                                checked
                                disabled
                              />
                              <label for="checkbox"
                                >Dostęp do danej funkcji w module</label
                              >
                            </div>
                            <div class="form-text text-start">
                              Opis uprawnienia, które jest przypisane do danej
                              roli
                            </div>
                          </div>
                        </div>
                        <!-- </div> -->
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
        @click="submit()"
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

import { OrganizationUserDTO } from "@/modules/subscription/api/dtos/OrganizationUserDTO"
import { UserAccessDTO } from "@/modules/subscription/api/dtos/UserAccessDTO"

import { container } from "tsyringe"
import type { IOrganizationUserService } from "@/modules/subscription/api/services/OrganizationUserService"
import type { IUserAccessService } from "@/modules/subscription/api/services/UserAccessService"
import AppErrorItems from "@/components/AppErrorItems.vue"
import ValidationError from "@/core/errors/ValidationError"

import { ErrorMessage, Field, Form, configure } from "vee-validate"

const props = defineProps({
  modalId: { type: String },
  user: { type: OrganizationUserDTO, required: true }
})
const emits = defineEmits(['refresh'])
const modal = ref<IModal>({
  settings: {
    id: props.modalId ?? '',
    size: 'modal-lg',
    backdrop: true,
    keyboard: true,
    title: 'Role użytkownika',
    subtitle: 'Edycja danych',
    color: 'warning'
  },
  btnText: 'Zapisz',
  btnLock: false
})

// const { id } = {...props.user }

const userService = container.resolve('IOrganizationUserService') as IOrganizationUserService
const userAccessService = container.resolve('IUserAccessService') as IUserAccessService
const userAccesses = ref<any>([UserAccessDTO])
const user = ref<OrganizationUserDTO>()

let validationErrors = ref<{key:string,errorMessage:string}[]>([])

configure({
  validateOnChange: true,
})

watch(
  () => props.user,
  async () => {
    if (props.user) {
      user.value = await userService.getOrganizationUser(props.user.id as string)
      userAccesses.value = await userAccessService.getModuleAccess(props.user.id)
    }
  }
)

let isRoleNameActive = ref<boolean>(true)
let isRoleNameSelected = ref<boolean>(false)
let isRoleNameEmpty = ref<boolean>(true)
let isRoleDetailsVisible = ref<boolean>(true)
let roleName = ref('')

const toggleRoleNameActivity = () => {
  isRoleNameActive.value = !isRoleNameActive.value
  // isRoleDetailsVisible.value = false
  if (roleName.value !== '') {
    roleName.value = ''
  }
}

const toggleRoleNameInfo = () => {
  if (roleName.value === '') {
    isRoleNameSelected.value = false
    isRoleNameEmpty.value = true
    isRoleDetailsVisible.value = false
    console.log('jeśli PUSTE')
  }
  isRoleNameSelected.value = true
  isRoleNameEmpty.value = false
  isRoleDetailsVisible.value = true
  console.log('jeśli COŚ MA')
}

const collapseRoleDetails = () => {
  isRoleDetailsVisible.value = !isRoleDetailsVisible.value
}

const validationSchema = {
  // roleName: 'required',
}

const submit = () => {
  modal.value.btnLock = true
  validationErrors.value = []
  
  try {
    //await service.createOrganizationUser(this.userId, this.organizationUsers as OrganizationUserDTO)

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Role ustawione',
      timer: 1000,
      showConfirmButton: false,
      showCloseButton: false,
    }).then((result) => {
      Modal.getInstance(modal.value.settings.id)?.hide()
      setTimeout(() => { modal.value.btnLock = false }, 1500)
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
      html: 'Użytkownik nie został dodany.<br>Sprawdź szczegółowe komunikaty lub odśwież stronę i spróbuj ponownie.',
      icon: 'error',
      showConfirmButton: true,
    }).then(() => {
      modal.value.btnLock = false
    })
  }
}
</script>
