<template>
  <div class="container">
    <div class="row bg-light border rounded m-0 py-3 px-2">
      <div class="col-12">
        <h4 class="border-bottom mb-3 pb-3">Nazwa</h4>
      </div>
      <div class="col-12 mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Wpisz nazwę usługi"
          autocomplete="off"
          v-model="service.name"
        >
      </div>
    </div>
    <hr>
    <div class="row bg-light border rounded m-0 pt-3 pb-0 px-2">
      <div class="col-12">
        <h4 class="border-bottom mb-3 pb-3">Czynności</h4>
      </div>
      <div class="col-12 mb-3">
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Wpisz nazwę czynności"
            v-model="actionName"
            @keyup="search()"
          >
          <button class="btn btn-primary" @click="clear()">Wyczyść</button>
        </div>
        <hr class="border-secondary border-opacity-75">
        <div
          class="form-check form-check-inline user-select-none mb-3"
          v-for="action in serviceActions.filter(x => x.isVisible)"
          :key="action.id"
        >
          <input
            class="form-check-input"
            type="checkbox"
            :id="'action-' + action.id"
            v-model="action.isChecked"
          >
          <label class="form-check-label" :for="'action-' + action.id">{{ action.name }} </label> <!--{{ action.isChecked }}-->
        </div>
      </div>
    </div>
    <hr>
    <div class="row bg-light border rounded m-0 pt-3 pb-0 px-2">
      <div class="col-12">
        <h4 class="border-bottom mb-3 pb-3">Parametry</h4>
      </div>
      <div class="col-12 mb-3">
        <div class="input-group">
          <select class="form-select" autocomplete="off" v-model="selectedParameter">
            <option value="0">Wybierz</option>
            <option v-for="parameter in parameters" :key="parameter.id" :value="parameter.id">
              {{ parameter.name }}
            </option>
          </select>
          <button class="btn btn-success ms-2" @click="addParameter(selectedParameter)" :disabled="selectedParameter < 0">Dodaj</button>
        </div>
        <div v-if="addedParameters">
          <hr class="border-secondary border-opacity-75">
          <div class="col-12 mb-3" v-for="parameter in addedParameters" :key="parameter.id">
            <div v-if="parameter.type === ParameterTypes.SingularSelection">
              <label class="form-label">{{ parameter.name }}:</label>
              <div class="input-group input-group-sm">
                <input type="text" class="form-control" placeholder="Wpisz domyślną wartość" v-model="parameter.value">
                <button class="btn btn-danger ms-2" @click="removeParameter(parameter.id)">Usuń</button>
              </div>
            </div>
            <div v-if="parameter.type === ParameterTypes.MultipleSelection">
              <label class="form-label">{{ parameter.name }}:</label>
              <div class="input-group input-group-sm">
                <input type="text" class="form-control" placeholder="Wpisz domyślną wartość" v-model="parameter.value">
                <button class="btn btn-danger ms-2" @click="removeParameter(parameter.id)">Usuń</button>
              </div>
            </div>
            <div v-if="parameter.type === ParameterTypes.TextInput">
              <label class="form-label">{{ parameter.name }}:</label>
              <div class="input-group input-group-sm">
                <input type="text" class="form-control" placeholder="Wpisz domyślną wartość" v-model="parameter.value">
                <button class="btn btn-danger ms-2" @click="removeParameter(parameter.id)">Usuń</button>
              </div>
            </div>
            <div v-if="parameter.type === ParameterTypes.Special">
              <label class="form-label">{{ parameter.name }}:</label>
              <div class="input-group input-group-sm">
                <input type="text" class="form-control" placeholder="Wpisz domyślną wartość" v-model="parameter.value">
                <button class="btn btn-danger ms-2" @click="removeParameter(parameter.id)">Usuń</button>
              </div>
            </div>
            <div v-if="parameter.type === ParameterTypes.TextArea">
              <label class="form-label">{{ parameter.name }}:</label>
              <div class="input-group input-group-sm">
                <input type="text" class="form-control" placeholder="Wpisz domyślną wartość" v-model="parameter.value">
                <button class="btn btn-danger ms-2" @click="removeParameter(parameter.id)">Usuń</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <div class="d-flex justify-content-between mb-5">
      <RouterLink :to="{ name: 'service-list' }" class="btn btn-secondary">Zamknij</RouterLink>
      <button class="btn btn-warning" @click="updateService()" :disabled="submitBtnLock">Zapisz</button>
    </div>
    <AppErrorItems :errors="validationErrors" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue" 
import { useRouter } from "vue-router"
import Swal from "sweetalert2"
import { container } from "tsyringe"
import type { IServiceService } from "@/modules/service/api/services/service/ServiceService"
import type { IServiceActionService } from "@/modules/service/api/services/service-action/ServiceActionService"
import type { IParameterService } from "@/modules/service/api/services/parameter/ParameterService"
import { ServiceDTO } from "@/modules/service/api/dtos/service/ServiceDTO"
import type { ServiceActionDTO } from "@/modules/service/api/dtos/service-action/ServiceActionDTO"
import type { ParameterDTO } from "@/modules/service/api/dtos/parameter/ParameterDTO"
import { ParameterCategories } from "@/modules/service/store/enums/StoreEnums"
import { ParameterTypes } from "@/modules/service/store/enums/StoreEnums"
import ValidationError from "@/core/errors/ValidationError"
import AppErrorItems from "@/components/AppErrorItems.vue"

const props = defineProps({
  serviceId: { type: Number, required: true }
})
const router = useRouter()

const serviceService = container.resolve('IServiceService') as IServiceService
const serviceActionService = container.resolve('IServiceActionService') as IServiceActionService
const parameterService = container.resolve('IParameterService') as IParameterService

const service = ref<ServiceDTO>(new ServiceDTO)
const serviceActions = ref<ServiceActionDTO[]>([])
const parameters = ref<ParameterDTO[]>([])
  
service.value = await serviceService.getService(props.serviceId)
serviceActions.value = await serviceActionService.getServiceActionsForEdit(props.serviceId)
parameters.value = await parameterService.getParametersForSelect(ParameterCategories.Service)

const actionName = ref()
const addedParameters = ref<ParameterDTO[]>(service.value.parameters)
const selectedParameter = ref<number>(0)
const submitBtnLock = ref(false)
let validationErrors = ref<{key: string, errorMessage: string}[]>([])


const clear = () => {
  actionName.value = ''
  serviceActions.value.forEach(x => x.isVisible = true)
}
const search = () => {
  serviceActions.value.forEach(
    (serviceActions) => {
      const splitSearch = actionName.value.toLowerCase().split(' ')
      const actionNameWords = serviceActions.name.toLowerCase().split(' ')
      serviceActions.isVisible = splitSearch.every((ss: string) => actionNameWords.some(an => an.includes(ss)))
    }
  )
}


const addParameter = async (parameterId: number) => {
  if (!addedParameters.value.find(ap => ap.id == parameterId) && selectedParameter.value > 0) {
    const p = parameters.value.find(x => x.id == parameterId) as ParameterDTO
    addedParameters.value.push(p)
  }
  selectedParameter.value = 0
}
const removeParameter = (parameterId: number) => {
  addedParameters.value = addedParameters.value.filter(ap => ap.id !== parameterId)
}


const updateService = async () => {
  try {
    submitBtnLock.value = true
    validationErrors.value = []

    const checkedActions = serviceActions.value.filter(
      x => x.isChecked
    ).map(
      x => x
    )

    await serviceService.updateService(
      props.serviceId as number,
      service.value as ServiceDTO,
      checkedActions as ServiceActionDTO[],
      addedParameters.value as ParameterDTO[]
    )

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Usługa zapisana',
      timer: 1000,
      showConfirmButton: false,
      showCloseButton: false,
    }).then(() => {
      service.value = new ServiceDTO
      submitBtnLock.value = false
      router.push('/service/services')
    })
  }
  catch (error: any) {
    if (error instanceof ValidationError) {
      validationErrors.value = Object.keys(error.Errors).map(key => {
        const arr = error.Errors[key] as []
        return { key,errorMessage:arr.join(',') }
      })
      submitBtnLock.value = false
      return
    }
    Swal.fire({
      title: 'Błąd serwera!',
      html: 'Sprawdź szczegółowe komunikaty lub odśwież stronę i spróbuj ponownie.',
      icon: 'error',
      showConfirmButton: true,
    }).then(() => {
      submitBtnLock.value = false
    })
  }
}
</script>