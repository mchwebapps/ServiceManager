<template>
  <AppModal :modal="modal.settings" :errors="errors">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 mt-3 mb-3">
          <span class="badge rounded-0" :class="'bg-' + color">Uprawnienia</span>
          <div class="border rounded-0 border-opacity-25 bg-opacity-10 py-3" :class="'border-' + color, 'bg-' + color">
            <div class="list-group mx-3">
              <a class="list-group-item" v-for="modulePlanPermission in modulePlanPermissions" :key="modulePlanPermission.key">
                <div class="d-flex align-items-center">
                  <input
                    type="checkbox"
                    class="form-check-input me-3" 
                    :name="`plan-${modulePlanId}-permission-${modulePlanPermission.key}`"
                    :id="`plan-${modulePlanId}-permission-${modulePlanPermission.key}`"
                    :checked="modulePlanPermission.isChecked"
                    disabled
                  >
                  <label class="form-check-label stretched-link" :for="`plan-${modulePlanId}-permission-${modulePlanPermission.key}`">
                    {{ modulePlanPermission.name }}
                    <div class="form-text user-select-none mt-0">{{ modulePlanPermission.description }}</div>
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
import type { ModulePlanDTO } from "@/modules/subscription/api/dtos/ModulePlanDTO"
import type { ModulePlanPermissionDTO } from "@/modules/subscription/api/dtos/ModulePlanPermissionDTO"

import { container } from "tsyringe"
import type { IModulePlanService } from "@/modules/subscription/api/services/ModulePlanService"
import type { IModulePlanPermissionService } from "@/modules/subscription/api/services/ModulePlanPermissionService"

const props = defineProps({
  moduleKey: { type: String, required: true },
  modulePlanId: { type: String, required: true },
})
const modal = ref<IModal>({
  settings: {
    id: '#ViewPlanPermissionsModal',
    size: '',
    backdrop: false,
    keyboard: false,
    title: 'Podgląd uprawnień',
    subtitle: 'Nazwa planu',
    color: 'primary'
  },
  btnText: '',
  btnLock: false
})
const color = 'primary'

const modulePlanService = container.resolve('IModulePlanService') as IModulePlanService
const modulePlanPermissionService = container.resolve('IModulePlanPermissionService') as IModulePlanPermissionService

const modulePlan = ref<ModulePlanDTO>()
const modulePlanPermissions = ref<ModulePlanPermissionDTO[]>([])

let errors = ref()

watch(
  () => props.modulePlanId,
  async (newId) => {
    modulePlan.value = await modulePlanService.getModulePlan(
      props.moduleKey,
      newId as string,
    )
    modulePlanPermissions.value = await modulePlanPermissionService.getModulePlanPermissions(
      props.moduleKey as string,
      newId as string,
    )
    modal.value.settings.subtitle = modulePlan.value.name
    await modulePlanPermissionService.getModulePlanPermissionsForEdit(
      props.moduleKey,
      newId as string,
    )
  },
  { deep: true }
)
</script>
