<template>
  <AppModal :modal="modal.settings" :errors="errors">

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
              <a class="list-group-item" v-for="modulePermission in modulePermissions" :key="modulePermission.key">
                <div class="d-flex align-items-center">
                  <input
                    type="checkbox"
                    class="form-check-input me-3" 
                    :name="`module-${moduleKey}-permission-${modulePermission.key}`"
                    :id="`module-${moduleKey}-permission-${modulePermission.key}`"
                    :value="modulePermission.key"
                    v-model="checkedPermissions"
                  >
                  <label class="form-check-label stretched-link" :for="`module-${moduleKey}-permission-${modulePermission.key}`">
                    {{ modulePermission.name }}
                    <div class="form-text user-select-none mt-0">{{ modulePermission.description }}</div>
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
        @click="reset()"
      >
        Zamknij
      </button>
      <button
        type="submit"
        :class="'btn btn-' + modal.settings.color"
        :disabled="modal.btnLock"
        @click="createRole()"
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
import { ref, onMounted } from "vue"
import Swal from "sweetalert2"
import { Modal } from "bootstrap"
import AppModal, { type IModal } from "@/components/AppModal.vue"
import AppFormText from "@/components/AppFormText.vue"

import { ModuleDTO } from "@/modules/subscription/api/dtos/ModuleDTO"
import { ModuleRoleDTO } from "@/modules/subscription/api/dtos/ModuleRoleDTO"
import { ModuleRolePermissionDTO } from "@/modules/subscription/api/dtos/ModuleRolePermissionDTO"
import type { ModulePermissionDTO } from "@/modules/subscription/api/dtos/ModulePermissionDTO"

import { container } from "tsyringe"
import type { IModuleService } from "@/modules/subscription/api/services/ModuleService"
import type { IModulePermissionService } from "@/modules/subscription/api/services/ModulePermissionService"
import type { IModuleRoleService } from "@/modules/subscription/api/services/ModuleRoleService"
import type { IModuleRolePermissionService } from "@/modules/subscription/api/services/ModuleRolePermissionService"

import AppErrorItems from "@/components/AppErrorItems.vue"
import ValidationError from "@/core/errors/ValidationError"

import { ErrorMessage, Field, Form } from "vee-validate"
import { Modules } from "@/modules/subscription/api/enums/StoreEnums"

const props = defineProps({
  moduleKey: { type: String, required: true },
  createUserCalback: { type: Function,required: false }
})
const emits = defineEmits(['refresh'])

const modal = ref<IModal>({
  settings: {
    id: '#CreateRoleModal',
    size: '',
    backdrop: true,
    keyboard: true,
    title: 'Zarządzanie rolami',
    subtitle: 'Nowa rola',
    color: 'success'
  },
  btnText: 'Dodaj',
  btnLock: false
})
let validationErrors = ref<{key: string, errorMessage: string}[]>([])
const color = 'primary'

const moduleService = container.resolve('IModuleService') as IModuleService
const modulePermissionService = container.resolve('IModulePermissionService') as IModulePermissionService
const moduleRoleService = container.resolve('IModuleRoleService') as IModuleRoleService
const moduleRolePermissionService = container.resolve('IModuleRolePermissionService') as IModuleRolePermissionService

const module = ref<ModuleDTO>()
const modulePermissions = ref<ModulePermissionDTO[]>([])
const moduleRole = ref(new ModuleRoleDTO())
const checkedPermissions = ref<string[]>([])

moduleService.getModule(props.moduleKey).then(
  x => {
    module.value = x
  } 
)

let errors = ref()

const validationSchema = {
  //modalRoleCreateModuleName: 'required',
  //modalRoleCreatePlanName: 'required',
  //modalRoleCreateRoleName: 'required|alpha_spaces|min:4|max:32'
}

onMounted(async () => {
  modulePermissions.value = await modulePermissionService.getPermissionsByModuleKey(
    props.moduleKey as string
  )
  module.value = await moduleService.getModule(
    props.moduleKey as string
  )
})

const reset = () => {
  setTimeout(() => {
    module.value = new ModuleDTO
    modulePermissions.value = []
    moduleRole.value = new ModuleRoleDTO
    checkedPermissions.value = []
  }, 500)
}


const createRole = async () => {
  modal.value.btnLock = true
  try {
    const roleId = await moduleRoleService.createModuleRole(
      props.moduleKey,
      moduleRole.value as ModuleRoleDTO
    )
    await moduleRolePermissionService.updateModuleRolePermissions(
      props.moduleKey,
      roleId,
      checkedPermissions.value
    )

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Rola utworzona!',
      timer: 1000,
      showConfirmButton: false,
      showCloseButton: false
    }).then(() => {
      Modal.getInstance(modal.value.settings.id)?.hide()
      setTimeout(() => {
        modal.value.btnLock = false
        moduleRole.value = new ModuleRoleDTO()
        checkedPermissions.value = []
      }, 1500)
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
