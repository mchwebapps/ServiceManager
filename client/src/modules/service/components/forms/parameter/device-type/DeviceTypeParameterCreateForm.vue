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
        <select class="form-select" v-model="parameter.type" @change="selectedOption()" autocomplete="off">
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
        <button class="btn btn-sm btn-success" @click="addParameterValue()"><i class="bi bi-plus"></i> Dodaj wartość parametru</button>
      </div>
      <hr>
      <div
        class="row bg-light border rounded m-0 mb-3 py-3 px-2"
        v-if="values.length > 0"
      >
        <div class="col-12">
          <h4 class="border-bottom mb-3 pb-3">Wartości</h4>
        </div>
        <div class="col-12 mb-3" v-for="(value, index) in values" :key="index">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              ref="editingValue"
              placeholder="Wpisz nazwę wartości"
              autocomplete="off"
              v-model="value.text"
            >
            <button
              class="btn btn-danger ms-2"
              :disabled="buttonLocked"
              @click="removeParameterValue(index)"
            >
              Usuń
            </button>
            <!-- v-show="index || !index && values.length > 1" -->
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-between mb-5">
      <RouterLink :to="{ name: 'device-type-parameter-list' }" class="btn btn-secondary">Zamknij</RouterLink>
      <button class="btn btn-primary" @click="createParameter()" :disabled="buttonLocked">Dodaj</button>
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
import { ParameterCreateDTO } from "@/modules/service/api/dtos/parameter/ParameterCreateDTO"
import { ParameterCategories, ParameterTypes } from "@/modules/service/store/enums/StoreEnums"
import { ParameterTypeHelper } from "@/modules/service/api/helpers/ParameterHelper"

import type { IParameterValueService } from "@/modules/service/api/services/parameter-value/ParameterValueService"
import { ParameterValueDTO } from "@/modules/service/api/dtos/parameter-value/ParameterValueDTO"

import ValidationError from "@/core/errors/ValidationError"
import AppErrorItems from "@/components/AppErrorItems.vue"

const props = defineProps({
  parameterCategory: { type: String, required: true }
})
const router = useRouter()

const parameterService = container.resolve('IParameterService') as IParameterService
const parameterValueService = container.resolve('IParameterValueService') as IParameterValueService
const parameter = ref<ParameterCreateDTO>(new ParameterCreateDTO)

const values = ref<ParameterValueDTO[]>([])

const buttonLocked = ref(false)
let validationErrors = ref<{key: string, errorMessage: string}[]>([])

const type = ref(parameter.value.type)
const isSelectOptionsVisible = (
  type.value === ParameterTypes.MultipleSelection || type.value === ParameterTypes.SingularSelection
) ? ref<boolean>(true) : ref<boolean>(false) 
const editingValue = ref<HTMLInputElement[]>([])

parameter.value.type = ParameterTypes.TextInput
parameter.value.category = props.parameterCategory as ParameterCategories.Device

const selectedOption = () => {
  const type = parameter.value.type
  isSelectOptionsVisible.value = (
    type === ParameterTypes.MultipleSelection || type === ParameterTypes.SingularSelection
  ) ? true : false
}

const addParameterValue = async () => {
  values.value.unshift(new ParameterValueDTO)
  await nextTick()
  editingValue.value[0].focus()
}
const removeParameterValue = (index: number) => values.value.splice(index, 1)


const createParameter = async () => {
  try {
    buttonLocked.value = true
    validationErrors.value = []
    editingValue.value.map(x => x.setAttribute('disabled', 'disabled'))

    const parameterId = await parameterService.createParameter(
      parameter.value
    )

    const newFilledValues = values.value.filter(x => x.text !== '')

    await parameterValueService.createParameterValues(
      parameterId,
      newFilledValues
    )

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Parametr utworzony',
      timer: 1000,
      showConfirmButton: false,
      showCloseButton: false,
    }).then(() => {
      buttonLocked.value = false
      values.value = []
      router.push('/service/device-type/parameters')
    })
  }
  catch (error: any) {
    if (error instanceof ValidationError) {
      validationErrors.value = Object.keys(error.Errors).map(key => {
        const arr = error.Errors[key] as []
        return { key,errorMessage:arr.join(',') }
      })
      buttonLocked.value = false
      editingValue.value.map(x => x.removeAttribute('disabled'))
      return
    }
    Swal.fire({
      title: 'Błąd serwera!',
      html: 'Sprawdź szczegółowe komunikaty lub odśwież stronę i spróbuj ponownie.',
      icon: 'error',
      showConfirmButton: true,
    }).then(() => {
      buttonLocked.value = false
      editingValue.value.map(x => x.removeAttribute('disabled'))
    })
  }
}
</script>
