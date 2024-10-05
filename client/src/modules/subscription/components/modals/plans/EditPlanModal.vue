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
              <a class="list-group-item" v-for="modulePlanPermission in modulePlanPermissions" :key="modulePlanPermission.key">
                <div class="d-flex align-items-center">
                  <input
                    type="checkbox"
                    class="form-check-input me-3"
                    autocomplete="off"
                    :name="`plan-${modulePlanId}-edit-permission-${modulePlanPermission.key}`"
                    :id="`plan-${modulePlanId}-edit-permission-${modulePlanPermission.key}`"
                    :value="modulePlanPermission.key"
                    v-model="modulePlanPermission.isChecked"
                  ><!--:checked="modulePlanPermission.isChecked"-->
                  <label class="form-check-label stretched-link" :for="`plan-${modulePlanId}-edit-permission-${modulePlanPermission.key}`">
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
      <button
        type="submit"
        :class="'btn btn-' + modal.settings.color"
        :disabled="modal.btnLock"
        @click="updatePlan()"
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
import AppFormText from "@/components/AppFormText.vue"
import type { ModulePlanPermissionDTO } from "@/modules/subscription/api/dtos/ModulePlanPermissionDTO"
import { ModulePlanDTO } from "@/modules/subscription/api/dtos/ModulePlanDTO"
import { container } from "tsyringe"
import type { IModulePlanService } from "@/modules/subscription/api/services/ModulePlanService"
import type { IModulePlanPermissionService } from "@/modules/subscription/api/services/ModulePlanPermissionService"
import ValidationError from "@/core/errors/ValidationError"
import AppErrorItems from "@/components/AppErrorItems.vue"

// import { ErrorMessage, Field, Form, useField, useForm } from "vee-validate"

const props = defineProps({
  moduleKey: { type: String, required: true },
  modulePlanId: { type: String, required: true },
})
const emits = defineEmits(['refresh'])
const modal = ref<IModal>({
  settings: {
    id: '#EditPlanModal',
    size: '',
    backdrop: true,
    keyboard: true,
    title: 'Zarządzanie planami',
    subtitle: 'Edycja planu',
    color: 'warning'
  },
  btnText: 'Zapisz',
  btnLock: false
})
let validationErrors = ref<{key: string, errorMessage: string}[]>([])
const color = 'primary'

const modulePlanService = container.resolve('IModulePlanService') as IModulePlanService
const modulePlanPermissionService = container.resolve('IModulePlanPermissionService') as IModulePlanPermissionService

const modulePlan = ref(new ModulePlanDTO())
const modulePlanPermissions = ref<ModulePlanPermissionDTO[]>([])

let organizationId = ref()

watch(
() => props.modulePlanId,
async (newId) => {
  modulePlanPermissions.value = await modulePlanPermissionService.getModulePlanPermissionsForEdit(
    props.moduleKey as string,
    newId as string,
  )
  modulePlan.value = await modulePlanService.getModulePlan(
    props.moduleKey as string,
    newId as string,
  )
},
{ deep: true }
)

const validationSchema = {}
let errors = ref()

const updatePlan = async() => {
  modal.value.btnLock = true
  try {
    await modulePlanService.updateModulePlan(
      props.moduleKey,
      props.modulePlanId,
      modulePlan.value as ModulePlanDTO,
    )
    const checkedPermissions = modulePlanPermissions.value.filter(
      x => x.isChecked
    ).map(
      x => x.key
    )
    await modulePlanPermissionService.updateModulePlanPermissions(
      props.moduleKey,
      props.modulePlanId,
      checkedPermissions
    )

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Plan zapisany',
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
</script>
