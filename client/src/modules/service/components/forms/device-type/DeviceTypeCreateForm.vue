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
          placeholder="Wpisz nazwę typu urządzenia"
          autocomplete="off"
          v-model="deviceType.name"
        >
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
          <div class="col-12 mb-3" v-for="newParameter in addedParameters" :key="newParameter.id">
            <div v-if="newParameter.type === ParameterTypes.SingularSelection">
              <label class="form-label">{{ newParameter.name }}:</label>
              <div class="input-group" >
                <input type="text" class="form-control" placeholder="Wpisz domyślną wartość" v-model="newParameter.value">
                <button class="btn btn-danger ms-2" @click="removeParameter(newParameter.id)">Usuń</button>
              </div>
            </div>
            <div v-if="newParameter.type === ParameterTypes.TextInput">
              <label class="form-label">{{ newParameter.name }}:</label>
              <div class="input-group" >
                <input type="text" class="form-control" placeholder="Wpisz domyślną wartość" v-model="newParameter.value">
                <button class="btn btn-danger ms-2" @click="removeParameter(newParameter.id)">Usuń</button>
              </div>
            </div>
            <div v-if="newParameter.type === ParameterTypes.Special">
              <label class="form-label">{{ newParameter.name }}:</label>
              <div class="input-group input-group-sm">
                <input type="text" class="form-control" placeholder="Wpisz domyślną wartość" v-model="newParameter.value">
                <button class="btn btn-danger ms-2" @click="removeParameter(newParameter.id)">Usuń</button>
              </div>
            </div>
            <div v-if="newParameter.type === ParameterTypes.TextArea">
              <label class="form-label">{{ newParameter.name }}:</label>
              <div class="input-group input-group-sm">
                <input type="text" class="form-control" placeholder="Wpisz domyślną wartość" v-model="newParameter.value">
                <button class="btn btn-danger ms-2" @click="removeParameter(newParameter.id)">Usuń</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <div class="row bg-light border rounded m-0 pt-3 pb-0 px-2">
      <div class="col-12">
        <h4 class="border-bottom mb-3 pb-3">Usługi</h4>
      </div>
      <div class="col-12 mb-3">
        <div class="input-group">
          <select class="form-select" autocomplete="off" v-model="selectedService">
            <option value="0">Wybierz</option>
            <option v-for="service in services" :key="service.id" :value="service.id">
              {{ service.name }}
            </option>
          </select>
          <button
            class="btn btn-success ms-2"
            @click="addService(selectedService)"
            :disabled="selectedService < 0"
          >
            Dodaj
          </button>
        </div>
      </div>
      <div class="col-12" v-if="addedServices.length > 0">
        <hr class="border-secondary border-opacity-75">
        <div class="row">
          <div class="col-12 col-xl-6 col-xxl-4 mb-3" v-for="newService in addedServices" :key="newService.id">
            <div class="input-group input-group-sm">
              <input type="text" class="form-control" :value="newService.name" disabled>
              <button class="btn btn-danger ms-2" @click="removeService(newService.id)">Usuń</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <div class="d-flex justify-content-between mb-5">
      <RouterLink :to="{ name: 'device-type-list' }" class="btn btn-secondary">Zamknij</RouterLink>
      <button class="btn btn-primary" @click="createDeviceType()" :disabled="submitBtnLock">Dodaj</button>
    </div>
    <AppErrorItems :errors="validationErrors" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import Swal from "sweetalert2"
import { container } from "tsyringe"
import type { IDeviceTypeService } from "@/modules/service/api/services/device-type/DeviceTypeService"
import type { IParameterService } from "@/modules/service/api/services/parameter/ParameterService"
import type { IServiceService } from "@/modules/service/api/services/service/ServiceService"
import { DeviceTypeDTO } from "@/modules/service/api/dtos/device-type/DeviceTypeDTO"
import type { ParameterDTO } from "@/modules/service/api/dtos/parameter/ParameterDTO"
import type { ServiceDTO } from "@/modules/service/api/dtos/service/ServiceDTO"
import { ParameterTypes } from "@/modules/service/store/enums/StoreEnums"
import { ParameterCategories } from "@/modules/service/store/enums/StoreEnums"
import ValidationError from "@/core/errors/ValidationError"
import AppErrorItems from "@/components/AppErrorItems.vue"

const router = useRouter()

const deviceTypeService = container.resolve('IDeviceTypeService') as IDeviceTypeService
const parameterService = container.resolve('IParameterService') as IParameterService
const serviceService = container.resolve('IServiceService') as IServiceService

const deviceType = ref<DeviceTypeDTO>(new DeviceTypeDTO)
const parameters = ref<ParameterDTO[]>([])
const services = ref<ServiceDTO[]>([])

parameters.value = await parameterService.getParametersForSelect(ParameterCategories.Device)
services.value = await serviceService.getServicesForSelect()

const addedParameters = ref<ParameterDTO[]>([])
const selectedParameter = ref<number>(0)
const addedServices = ref<ServiceDTO[]>([])
const selectedService = ref<number>(0)
const submitBtnLock = ref(false)
let validationErrors = ref<{key: string, errorMessage: string}[]>([])


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


const addService = async (serviceId: number) => {
  if (!addedServices.value.find(x => x.id == serviceId) && selectedService.value > 0) {
    const s = services.value.find(x => x.id == serviceId) as ServiceDTO
    addedServices.value.push(s)
  }
  selectedService.value = 0
}

const removeService = (serviceId: number) => {
  addedServices.value = addedServices.value.filter(x => x.id !== serviceId)
}


const createDeviceType = async () => {
  try {
    submitBtnLock.value = true
    validationErrors.value = []

    await deviceTypeService.createDeviceType(
      deviceType.value as DeviceTypeDTO,
      addedParameters.value as ParameterDTO[],
      addedServices.value as ServiceDTO[]
    )

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Typ utworzony',
      timer: 1000,
      showConfirmButton: false,
      showCloseButton: false,
    }).then(() => {
      deviceType.value = new DeviceTypeDTO
      submitBtnLock.value = false
      router.push('/service/device-types')
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