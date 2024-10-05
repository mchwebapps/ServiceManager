<template>
  <AppModal :modal="modal.settings" :errors="errors">

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
          <label for="roleName" class="form-label">Nazwa roli:</label>
          <input type="text" class="form-control form-control-sm" id="roleName" placeholder="Wpisz nazwę roli" autocomplete="off" v-model="moduleRole.name">
          <AppFormText color="success">Od 4 do 32 znaków (a-z A-Z)</AppFormText>
        </div>
        <div class="col-12 mb-3">
          <label for="roleDescription" class="form-label">Opis roli:</label>
          <input type="text" class="form-control form-control-sm" id="roleDescription" placeholder="Wpisz opis roli" autocomplete="off" v-model="moduleRole.description">
          <AppFormText color="success">Do 128 znaków (a-z A-Z)</AppFormText>
        </div>
        <div class="col-12 mt-3 mb-3">
          <span class="badge rounded-0" :class="'bg-' + color">Uprawnienia</span>
          <div class="border rounded-0 border-opacity-25 bg-opacity-10 py-3" :class="'border-' + color, 'bg-' + color">
            <div class="list-group mx-3">
              <a class="list-group-item" v-for="moduleRolePermission in moduleRolePermissions" :key="moduleRolePermission.key">
                <div class="d-flex align-items-center">
                  <input
                    type="checkbox"
                    class="form-check-input me-3"
                    autocomplete="off"
                    :name="`role-${moduleRoleId}-edit-permission-${moduleRolePermission.key}`"
                    :id="`role-${moduleRoleId}-edit-permission-${moduleRolePermission.key}`"
                    :value="moduleRolePermission.key"
                    v-model="moduleRolePermission.isChecked"
                  ><!--:checked="moduleRolePermission.isChecked"-->
                  <label class="form-check-label stretched-link" :for="`role-${moduleRoleId}-edit-permission-${moduleRolePermission.key}`">
                    {{ moduleRolePermission.name }}
                    <div class="form-text user-select-none mt-0">{{ moduleRolePermission.description }}</div>
                  </label>
                </div>
              </a>
            </div>
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
        @click="updateRole()"
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
import { ref, watch, onMounted } from "vue"
import Swal from "sweetalert2/dist/sweetalert2.js"
import { Modal } from "bootstrap"
import AppModal, { type IModal } from "@/components/AppModal.vue"
import AppFormText from "@/components/AppFormText.vue"
import type { ModuleRolePermissionDTO } from "@/modules/subscription/api/dtos/ModuleRolePermissionDTO"
import { ModuleRoleDTO } from "@/modules/subscription/api/dtos/ModuleRoleDTO"
import { container } from "tsyringe"
import type { IModuleRoleService } from "@/modules/subscription/api/services/ModuleRoleService"
import type { IModuleRolePermissionService } from "@/modules/subscription/api/services/ModuleRolePermissionService"
import ValidationError from "@/core/errors/ValidationError"
import AppErrorItems from "@/components/AppErrorItems.vue"
import { ErrorMessage, Field, Form, useField, useForm } from "vee-validate"

const props = defineProps({
  moduleKey: { type: String, required: true },
  moduleRoleId: { type: String, required: false }
})
const emits = defineEmits(['refresh'])
const modal = ref<IModal>({
  settings: {
    id: '#EditRoleModal',
    size: '',
    backdrop: true,
    keyboard: true,
    title: 'Zarządzanie rolami',
    subtitle: 'Edycja roli',
    color: 'warning'
  },
  btnText: 'Zapisz',
  btnLock: false
})
let validationErrors = ref<{key: string, errorMessage: string}[]>([])
const color = 'primary'

const moduleRoleService = container.resolve('IModuleRoleService') as IModuleRoleService
const moduleRolePermissionService = container.resolve('IModuleRolePermissionService') as IModuleRolePermissionService

const moduleRolePermissions = ref<ModuleRolePermissionDTO[]>([])
const moduleRole = ref(new ModuleRoleDTO())

let organizationId = ref()
let errors = ref()

const validationSchema = {
  //modalRoleCreateModuleName: 'required',
  //modalRoleCreatePlanName: 'required',
  //modalRoleCreateRoleName: 'required|alpha_spaces|min:4|max:32',
}

const updateRole = async() => {
  modal.value.btnLock = true
  try {
    await moduleRoleService.updateModuleRole(
      props.moduleKey,
      props.moduleRoleId as string,
      moduleRole.value as ModuleRoleDTO,
      organizationId.value as string
    )
    const checkedPermissions = moduleRolePermissions.value.filter(
      x => x.isChecked
    ).map(
      x => x.key
    )
    await moduleRolePermissionService.updateModuleRolePermissions(
      props.moduleKey,
      props.moduleRoleId as string,
      checkedPermissions
    )

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Rola zapisana',
      timer: 1000,
      showConfirmButton: false,
      showCloseButton: false,
    }).then(() => {
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
      html: 'Sprawdź szczegółowe komunikaty lub odśwież stronę i spróbuj ponownie.',
      icon: 'error',
      showConfirmButton: true,
    }).then(() => {
      modal.value.btnLock = false
    })
  }
}

watch(
  () => props.moduleRoleId,
  async (newId) => {
    moduleRolePermissions.value = await moduleRolePermissionService.getModuleRolePermissionsForEdit(
      props.moduleKey as string,
      newId as string,
    )
    moduleRole.value = await moduleRoleService.getModuleRole(
      props.moduleKey as string,
      newId as string,
    )
  },
  { deep: true }
)
</script>
