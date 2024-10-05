<template>
  <div class="container">
    <div class="row bg-light border rounded m-0 py-3 px-2">
      <div class="col-12 col-lg-6 col-xxl-3 mb-3">
        <label class="form-label">Nazwa parametru:</label>
        <input type="text" class="form-control" placeholder="Wpisz nazwę usługi" v-model="parameter.name" autocomplete="off">
      </div>
      <div class="col-12 col-lg-6 col-xxl-3 mb-3">
        <label class="form-label">Alias:</label>
        <input type="text" class="form-control" placeholder="Wpisz alias" v-model="parameter.alias" autocomplete="off">
      </div>
      <div class="col-12 col-lg-6 col-xxl-3 mb-3">
        <label class="form-label">Rodzaj:</label>
        <select class="form-select" v-model="parameter.type" @change="selectedOption()">
          <option v-for="parameterType in ParameterTypes" :value="parameterType">
            {{ ParameterTypeHelper.getParameterTypeName(parameterType) }}
          </option>
        </select>
      </div>
      <div class="col-12 col-lg-6 col-xxl-3 mb-3">
        <label class="form-label d-block">Wymagane:</label>
        <select class="form-select">
          <option value="0" selected>Nie</option>
          <option value="1">Tak</option>
        </select>
      </div>
    </div>
    <hr>
    <div v-if="isSelectOptionsVisible">
      <div class="d-flex">
        <button class="btn btn-sm btn-success" @click="addNewParameterValue()">
          <i class="bi bi-plus"></i> Dodaj wartość parametru
        </button>
      </div>
      <hr>
      <div
        class="row bg-light border rounded m-0 mb-3 py-3 px-2"
        v-if="oldValues.length > 0 || newValues.length > 0"
      >
        <label class="form-label">Wartości:</label>
        <div class="col-12 mb-3" v-for="(newValue, index) in newValues" :key="index">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              ref="editingNewValue"
              placeholder="Wpisz nazwę wartości"
              autocomplete="off"
              v-model="newValue.text"
            >
            <button
              class="btn btn-danger ms-2"
              :disabled="buttonLocked"
              @click="removeNewParameterValue(index)"
            >
              Usuń
            </button>
          </div>
        </div>
        <div class="col-12 mb-3" v-for="(oldValue, index) in oldValues" :key="index">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              ref="editingOldValue"
              placeholder="Wpisz nazwę wartości"
              autocomplete="off"
              disabled
              v-model="oldValue.text"
            >
            <button
              class="btn btn-success ms-2 d-none"
              ref="saveButton"
              :disabled="buttonLocked"
              @click="saveOldParameterValue(index, oldValue.id, oldValue)"
            >
              Zapisz
            </button>
            <button
              class="btn btn-warning ms-2"
              ref="editButton"
              :disabled="buttonLocked"
              @click="editOldParameterValue(index)"
            >
              Edytuj
            </button>
            <button
              class="btn btn-danger ms-2"
              :disabled="buttonLocked"
              @click="deleteOldParameterValue(oldValue.id)"
            >
              Usuń
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-between mb-5">
      <RouterLink :to="{ name: 'service-parameter-list' }" class="btn btn-secondary">Zamknij</RouterLink>
      <button class="btn btn-primary" @click="saveParameter()" :disabled="buttonLocked">Zapisz</button>
    </div>
    <AppErrorItems :errors="validationErrors" />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue"
import { useRouter } from "vue-router"
import Swal from "sweetalert2"

import { container } from "tsyringe"
import type { IParameterService } from "@/modules/service/api/services/parameter/ParameterService"
import { ParameterDTO } from "@/modules/service/api/dtos/parameter/ParameterDTO"
import { ParameterTypes } from "@/modules/service/store/enums/StoreEnums"
import { ParameterTypeHelper } from "@/modules/service/api/helpers/ParameterHelper"

import type { IParameterValueService } from "@/modules/service/api/services/parameter-value/ParameterValueService"
import { ParameterValueDTO } from "@/modules/service/api/dtos/parameter-value/ParameterValueDTO"

import ValidationError from "@/core/errors/ValidationError"
import AppErrorItems from "@/components/AppErrorItems.vue"

const props = defineProps({
  parameterId: { type: Number, required: true },
  parameterCategory: { type: String, required: true }
})
const router = useRouter()

const parameterService = container.resolve('IParameterService') as IParameterService
const parameterValueService = container.resolve('IParameterValueService') as IParameterValueService
const parameter = ref<ParameterDTO>(new ParameterDTO)
const oldValues = ref<ParameterValueDTO[]>([])
const newValues = ref<ParameterValueDTO[]>([])
parameter.value = await parameterService.getParameter(props.parameterId)
oldValues.value = await parameterValueService.getParameterValues(props.parameterId)

const buttonLocked = ref(false)
let validationErrors = ref<{key: string, errorMessage: string}[]>([])

const type = ref(parameter.value.type)
const isSelectOptionsVisible = (
  type.value === ParameterTypes.MultipleSelection || type.value === ParameterTypes.SingularSelection
) ? ref<boolean>(true) : ref<boolean>(false) 
const editingOldValue = ref<HTMLInputElement[]>([])
const editingNewValue = ref<HTMLInputElement[]>([])
const editButton = ref<HTMLElement[]>([])
const saveButton = ref<HTMLElement[]>([])

const selectedOption = () => {
  const type = parameter.value.type
  isSelectOptionsVisible.value = (
    type === ParameterTypes.MultipleSelection || type === ParameterTypes.SingularSelection
  ) ? true : false
}

const refreshOldValues = async () => {
  const refreshedOldValues = await parameterValueService.getParameterValues(props.parameterId)
  oldValues.value = refreshedOldValues
}

const addNewParameterValue = async () => {
  newValues.value.unshift(new ParameterValueDTO)
  await nextTick()
  editingNewValue.value[0].focus()
}
const removeNewParameterValue = (index: number) => newValues.value.splice(index, 1)

const saveOldParameterValue = async (index: number, parameterValueId: number, data: ParameterValueDTO) => {
  try {
    buttonLocked.value = true
    validationErrors.value = []
    editingOldValue.value[index].setAttribute('disabled', 'disabled')

    await parameterValueService.updateParameterValue(
      props.parameterId as number,
      parameterValueId,
      data
    )

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Wartość zapisana',
      timer: 1000,
      showConfirmButton: false,
      showCloseButton: false,
    }).then(() => {
      buttonLocked.value = false
      editButton.value[index].classList.remove('d-none')
      saveButton.value[index].classList.add('d-none')
    })
  }
  catch (error: any) {
    if (error instanceof ValidationError) {
      validationErrors.value = Object.keys(error.Errors).map(key => {
        const arr = error.Errors[key] as []
        return { key,errorMessage:arr.join(',') }
      })
      buttonLocked.value = false
      editingOldValue.value[index].removeAttribute('disabled')
      return
    }
    Swal.fire({
      title: 'Błąd serwera!',
      html: 'Sprawdź szczegółowe komunikaty lub odśwież stronę i spróbuj ponownie.',
      icon: 'error',
      showConfirmButton: true,
    }).then(() => {
      buttonLocked.value = false
      editingOldValue.value[index].removeAttribute('disabled')
    })
  }
}
const editOldParameterValue = (index: number) => {
  editingOldValue.value[index].removeAttribute('disabled')
  editingOldValue.value[index].focus()
  editButton.value[index].classList.add('d-none')
  saveButton.value[index].classList.remove('d-none')
}

const deleteOldParameterValue = async (parameterValueId: number) => {
  try {
    buttonLocked.value = true

    Swal.fire({
      icon: 'question',
      html: 'Czy na pewno chcesz usunąć tę wartość?',
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
          await parameterValueService.deleteParameterValue(parameterValueId)

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Wartość usunięta',
            timer: 1000,
            showConfirmButton: false,
            showCloseButton: false,
          }).then(() => {
            buttonLocked.value = false
            refreshOldValues()
          })
        }
      }
    )
  }
  catch (error: any) {
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

const saveParameter = async () => {
  try {
    buttonLocked.value = true
    validationErrors.value = []
    editingNewValue.value.map(x => x.setAttribute('disabled', 'disabled'))

    await parameterService.updateParameter(
      props.parameterId as number,
      parameter.value
    )

    const newFilledValues = newValues.value.filter(x => x.text !== '')

    await parameterValueService.createParameterValues(
      props.parameterId,
      newFilledValues
    )

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Parametr zapisany',
      timer: 1000,
      showConfirmButton: false,
      showCloseButton: false,
    }).then(() => {
      buttonLocked.value = false
      newValues.value = []
      refreshOldValues()
      router.push('/service/service/parameters')
    })
  }
  catch (error: any) {
    if (error instanceof ValidationError) {
      validationErrors.value = Object.keys(error.Errors).map(key => {
        const arr = error.Errors[key] as []
        return { key,errorMessage:arr.join(',') }
      })
      buttonLocked.value = false
      editingNewValue.value.map(x => x.removeAttribute('disabled'))
      return
    }
    Swal.fire({
      title: 'Błąd serwera!',
      html: 'Sprawdź szczegółowe komunikaty lub odśwież stronę i spróbuj ponownie.',
      icon: 'error',
      showConfirmButton: true,
    }).then(() => {
      buttonLocked.value = false
      editingNewValue.value.map(x => x.removeAttribute('disabled'))
    })
  }
}
</script>
