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
        <div class="col-12 mt-3 mb-3">
          <span class="badge rounded-0" :class="'bg-' + color">Uprawnienia</span>
          <div class="border rounded-0 border-opacity-25 bg-opacity-10 py-3" :class="'border-' + color, 'bg-' + color">
            <div class="list-group mx-3">
              <a class="list-group-item" v-for="moduleRolePermission in moduleRolePermissions" :key="moduleRolePermission.key">
                <div class="d-flex align-items-center">
                  <input
                    type="checkbox"
                    class="form-check-input me-3" 
                    :name="`role-${moduleRoleId}-permission-${moduleRolePermission.key}`"
                    :id="`role-${moduleRoleId}-permission-${moduleRolePermission.key}`"
                    :checked="moduleRolePermission.isChecked"
                    disabled
                  >
                  <label class="form-check-label stretched-link" :for="`role-${moduleRoleId}-permission-${moduleRolePermission.key}`">
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
    </template>

  </AppModal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import AppModal, { type IModal } from "@/components/AppModal.vue"
import type { ModuleRoleDTO } from "@/modules/subscription/api/dtos/ModuleRoleDTO"
import type { ModuleRolePermissionDTO } from "@/modules/subscription/api/dtos/ModuleRolePermissionDTO"

import { container } from "tsyringe"
import type { IModuleRolePermissionService } from "@/modules/subscription/api/services/ModuleRolePermissionService"
import type { IModuleRoleService } from "@/modules/subscription/api/services/ModuleRoleService"

const props = defineProps({
  moduleKey: { type: String, required: true },
  moduleRoleId: { type: String, required: false }
})
const modal = ref<IModal>({
  settings: {
    id: '#ViewRolePermissionsModal',
    size: '',
    backdrop: false,
    keyboard: false,
    title: 'Podgląd uprawnień',
    subtitle: '',
    color: 'primary'
  },
  btnText: '',
  btnLock: false
})
const color = 'primary'

const moduleRoleService = container.resolve('IModuleRoleService') as IModuleRoleService
const moduleRolePermissionService = container.resolve('IModuleRolePermissionService') as IModuleRolePermissionService
const moduleRole = ref<ModuleRoleDTO>()
const moduleRolePermissions = ref<ModuleRolePermissionDTO[]>([])

let errors = ref()

watch(
  () => props.moduleRoleId,
  async (newId) => {
    moduleRole.value = await moduleRoleService.getModuleRole(
      props.moduleKey,
      newId as string,
    )
    moduleRolePermissions.value = await moduleRolePermissionService.getModuleRolePermissions(
      props.moduleKey as string,
      newId as string,
    )
    modal.value.settings.subtitle = moduleRole.value.name
    await moduleRolePermissionService.getModuleRolePermissionsForEdit(
      props.moduleKey,
      newId as string,
    )
  },
  { deep: true }
)
</script>
