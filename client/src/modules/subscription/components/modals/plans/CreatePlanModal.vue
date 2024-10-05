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
          <label for="planName" class="form-label">Nazwa planu:</label>
          <input type="text" class="form-control form-control-sm" id="planName" placeholder="Wpisz nazwę planu" autocomplete="off" v-model="modulePlan.name">
          <AppFormText color="success">Od 4 do 32 znaków (a-z A-Z)</AppFormText>
        </div>
        <div class="col-12 mb-3">
          <label for="planDescription" class="form-label">Opis planu:</label>
          <input type="text" class="form-control form-control-sm" id="planDescription" placeholder="Wpisz opis planu" autocomplete="off" v-model="modulePlan.description">
          <AppFormText color="success">Do 128 znaków (a-z A-Z)</AppFormText>
        </div>
        <div class="col-12 col-md-6 mb-3">
          <label for="planPrice" class="form-label">Cena planu:</label>
          <input type="text" class="form-control form-control-sm" id="planPrice" placeholder="Wpisz cenę planu" autocomplete="off" v-model="modulePlan.price">
          <AppFormText color="success">Format: 0.00</AppFormText>
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
        @click="createPlan()"
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
import type { ModulePermissionDTO } from "@/modules/subscription/api/dtos/ModulePermissionDTO"
import { ModulePlanDTO } from "@/modules/subscription/api/dtos/ModulePlanDTO"
import { container } from "tsyringe"
import type { IModuleService } from "@/modules/subscription/api/services/ModuleService"
import type { IModulePermissionService } from "@/modules/subscription/api/services/ModulePermissionService"
import type { IModulePlanService } from "@/modules/subscription/api/services/ModulePlanService"
import type { IModulePlanPermissionService } from "@/modules/subscription/api/services/ModulePlanPermissionService"
import ValidationError from "@/core/errors/ValidationError"
import AppErrorItems from "@/components/AppErrorItems.vue"

// import { ErrorMessage, Field, Form } from "vee-validate"

const props = defineProps({
  moduleKey: { type: String, required: true },
  createUserCallback: { type: Function, required: false }
})
const emits = defineEmits(['refresh'])

const modal = ref<IModal>({
  settings: {
    id: '#CreatePlanModal',
    size: '',
    backdrop: true,
    keyboard: true,
    title: 'Zarządzanie planami',
    subtitle: 'Nowy plan',
    color: 'success'
  },
  btnText: 'Dodaj',
  btnLock: false
})
let validationErrors = ref<{key: string, errorMessage: string}[]>([])
const color = 'primary'

const moduleService = container.resolve('IModuleService') as IModuleService
const modulePermissionService = container.resolve('IModulePermissionService') as IModulePermissionService
const modulePlanService = container.resolve('IModulePlanService') as IModulePlanService
const modulePlanPermissionService = container.resolve('IModulePlanPermissionService') as IModulePlanPermissionService

const module = ref<ModuleDTO>()
const modulePermissions = ref<ModulePermissionDTO[]>([])
const modulePlan = ref(new ModulePlanDTO())

moduleService.getModule(props.moduleKey).then(
  x => {
    module.value = x
  } 
)
const checkedPermissions = ref<string[]>([])
let errors = ref()

const validationSchema = {}

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
    modulePlan.value = new ModulePlanDTO
  }, 500)
}

const createPlan = async() => {
  modal.value.btnLock = true
  try {
    const planId = await modulePlanService.createModulePlan(
      props.moduleKey,
      modulePlan.value as ModulePlanDTO
    )
    await modulePlanPermissionService.updateModulePlanPermissions(
      props.moduleKey,
      planId,
      checkedPermissions.value
    )
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Plan dodany',
      timer: 1000,
      showConfirmButton: false,
      showCloseButton: false,
    }).then(() => {
      Modal.getInstance(modal.value.settings.id)?.hide()
      setTimeout(() => { 
        modal.value.btnLock = false
        modulePlan.value = new ModulePlanDTO()
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
