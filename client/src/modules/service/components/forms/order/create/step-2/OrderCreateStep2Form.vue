<template>
  <div class="container" v-if="devices.length > 0 || orderStore.getOrder.devices?.length > 0">
    <div class="row bg-light border rounded m-0 mb-3 py-3 px-2">
      <div class="col-12">
        <h4 class="border-bottom mb-3 pb-3">Urządzenia</h4>
      </div>
      <div class="col-12">
        <ul class="list-group">
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
            v-for="(device, index) in devices" :key="device.id"
          >
            <span v-for="parameter in device.parameters" :key="parameter.id">
              {{ (parameter.isMain) ? parameter.textValue : '' }}
            </span>
            <button class="btn btn-sm btn-danger" @click="removeDevice(index)">Usuń</button>
          </li>
        </ul>
      </div>
      <div class="d-flex justify-content-center mt-3">
        <button
          class="btn btn-success"
          @click="isActive = true, goBackButtonLocked = true"
          v-if="devices.length > 0, isActive === false"
        >
          Dodaj kolejne urządzenie
        </button>
      </div>
    </div>
  </div>
  <div class="container" v-if="isActive">
    <div class="row bg-light border rounded m-0 mb-3 py-3 px-2">
      <div class="col-12">
        <h4 class="border-bottom mb-3 pb-3">Typ urządzenia</h4>
      </div>
      <div class="col-12">
        <div class="mb-3">
          <select
            class="form-select"
            autocomplete="off"
            v-model="orderDeviceTypeId"
            @change="
              getOrderDeviceTypeParameters(orderDeviceTypeId),
              getOrderDeviceTypeServices(orderDeviceTypeId)
            "
          >
            <option value="0">Wybierz</option>
            <option
              v-for="deviceType in orderDeviceTypes"
              :key="deviceType.id"
              :value="deviceType.id"
            >
              {{ deviceType.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <hr v-if="orderDeviceTypeId > 0">
    <div
      class="row bg-light border rounded m-0 mb-3 py-3 px-2"
      v-if="orderDeviceTypeId > 0 && orderDeviceTypeParameters.length > 0"
    >
      <div class="col-12">
        <h4 class="border-bottom mb-3 pb-3">Parametry</h4>
      </div>
      <div
        class="col-12"
        :class="{ 'col-lg-6 col-xl-3': parameter.type !== ParameterTypes.TextArea }"
        v-for="parameter in orderDeviceTypeParameters"
        :key="parameter.id"
      >
        <div class="mb-3" v-if="parameter.type == ParameterTypes.SingularSelection">
          <label class="form-label">{{ parameter.name }}:</label>
          <select class="form-select" autocomplete="off" v-model="parameter.value">
            <option
              v-for="value in parameter.values"
              :key="value.id"
              :value="value.id"
            >
              {{ value.text }}
            </option>
          </select>
        </div>
        <div class="mb-3" v-if="parameter.type == ParameterTypes.TextInput">
          <label class="form-label">{{ parameter.name }}:</label>
          <input class="form-control" autocomplete="off" v-model="parameter.value">
        </div>
        <div class="mb-3" v-if="parameter.type == ParameterTypes.Special">
          <label class="form-label">{{ parameter.name }}:</label>
          <input class="form-control" autocomplete="off" v-model="parameter.value">
        </div>
        <div class="mb-3" v-if="parameter.type == ParameterTypes.TextArea">
          <label class="form-label">{{ parameter.name }}:</label>
          <textarea class="form-control" rows="1" autocomplete="off" v-model="(parameter.value as string)"></textarea>
        </div>
      </div>
    </div>
    <hr v-if="orderDeviceTypeId > 0 && orderDeviceTypeServices.length > 0">
    <div
      class="row bg-light border rounded m-0 py-3 px-2"
      v-if="orderDeviceTypeId > 0 && orderDeviceTypeServices.length > 0"
    >
      <div class="col-12">
        <h4 class="border-bottom mb-3 pb-3">Usługi</h4>
      </div>
      <div class="col-12">
        <div class="input-group mb-3">
          <select class="form-select" v-model="selectedService" autocomplete="off">
            <option value="0">Wybierz</option>
            <option v-for="service in orderDeviceTypeServices" :key="service.id" :value="service.id">
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
        <div class="row" v-for="service in addedServices" :key="service.id">
          <div class="col-12 mb-3">
            <div class="input-group">
              <input type="text" class="form-control" :value="service.name" disabled>
              <button class="btn btn-danger ms-2" @click="removeService(service.id)">Usuń</button>
            </div>
          </div>
          <div class="col-12 col-xl-3 mb-3" v-for="parameter in service.parameters">
            <div class="mb-3">
              <label class="form-label">{{ parameter.name }}</label>
              <input type="number" ref="addedService" class="form-control" placeholder="Wpisz cenę" v-model="parameter.value">
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <div class="row bg-light border rounded m-0 py-3 px-2">
      <div class="col-12">
        <h4 class="border-bottom mb-3 pb-3">Terminy</h4>
      </div>
      <div class="col-12 col-xl-6 col-xxl-3">
        <div class="mb-3">
          <label class="form-label">Data przyjęcia:</label>
          <div class="input-group">
            <input type="date" class="form-control" v-model="device.admissionDate" autocomplete="off">
            <span class="input-group-text">
              <i class="bi bi-calendar"></i>
            </span>
          </div>
        </div>
      </div>
      <div class="col-12 col-xl-6 col-xxl-3">
        <div class="mb-3">
          <label class="form-label">Termin realizacji:</label>
          <div class="input-group">
            <input type="date" class="form-control" v-model="device.deadline" autocomplete="off">
            <span class="input-group-text">
              <i class="bi bi-calendar"></i>
            </span>
          </div>
        </div>
      </div>
      <div class="col-12 col-xl-6 col-xxl-3">
        <div class="mb-3">
          <label class="form-label">Termin płatności (dni):</label>
          <select class="form-select" autocomplete="off">
            <option value="7">7</option>
            <option value="14">14</option>
            <option value="21">21</option>
          </select>
        </div>
      </div>
      <div class="col-12 col-xl-6 col-xxl-3">
        <div class="mb-3">
          <label class="form-label">Termin płatności (data):</label>
          <div class="input-group">
            <input type="date" class="form-control" v-model="device.paymentTerm" autocomplete="off" >
            <span class="input-group-text">
              <i class="bi bi-calendar"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <div class="row bg-light border rounded m-0 py-3 px-2">
      <div class="col-12">
        <h4 class="border-bottom mb-3 pb-3">Pracownik</h4>
      </div>
      <div class="col-12">
        <div class="mb-3">
          <select class="form-select" v-model="device.workerId" autocomplete="off">
            <option value="0">Wybierz</option>
            <option v-for="worker in orderWorkers" :key="worker.id" :value="worker.id">
              {{ worker.firstName }} {{ worker.lastName }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <div class="container mt-3" v-if="isActive === true">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-center border-top pt-3">
          <button
            class="btn btn-danger me-2"
            @click="isActive = false, goBackButtonLocked = false"
            v-if="devices.length > 0"
          >
            Anuluj
          </button>
          <button
            class="btn btn-success"
            @click="addDevice(), goBackButtonLocked = false"
            :disabled="addedServices.length === 0"
          >
            Dodaj
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="container mt-3 mb-5">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between border-top pt-3">
          <button
            class="btn btn-primary"
            :disabled="goBackButtonLocked"
            @click="orderStore.goBack(orderStore.getStep)"
          >
            Wstecz
          </button>
          <button
            class="btn btn-primary"
            :class="{ 'ms-auto': orderStore.getStep == 1 }"
            @click="addDevice(), addToStore(), orderStore.goNext(orderStore.getStep)"
            :disabled="addedServices.length === 0"
            v-if="isActive === true"
          >
            Dodaj i kontynuuj
          </button>
          <button
            class="btn btn-primary"
            :class="{ 'ms-auto': orderStore.getStep == 1 }"
            @click="addToStore(), orderStore.goNext(orderStore.getStep)"
            v-if="devices.length > 0, isActive === false"
          >
            Kontynuuj
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue"
import { useOrderCreateForm } from "@/modules/service/store/order"

import { container } from "tsyringe"
import type { IOrderCreateService } from "@/modules/service/api/services/order/OrderCreateService"
import type { IServiceService } from "@/modules/service/api/services/service/ServiceService"
import { OrderWizardDeviceDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardDeviceDTO"
import type { OrderWizardDeviceTypeDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardDeviceTypeDTO"
import type { OrderWizardDeviceTypeParameterDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardDeviceTypeParameterDTO"
import type { OrderWizardDeviceTypeServiceDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardDeviceTypeServiceDTO"
import type { OrderWizardWorkerDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardWorkerDTO"

import { ParameterTypes } from "@/modules/service/store/enums/StoreEnums"

const orderStore = useOrderCreateForm()
const orderCreateService = container.resolve('IOrderCreateService') as IOrderCreateService
const serviceService = container.resolve('IServiceService') as IServiceService

const isActive = ref<boolean>(true)
const goBackButtonLocked = ref<boolean>(false)
const devices = ref<OrderWizardDeviceDTO[]>([])
const device = ref<OrderWizardDeviceDTO>(new OrderWizardDeviceDTO)

if (orderStore.getOrder.devices?.length > 0) {
  devices.value = orderStore.getOrder.devices
  isActive.value = false
}

const orderDeviceTypeId = ref<number>(1)
const orderDeviceTypes = ref<OrderWizardDeviceTypeDTO[]>([])
const orderDeviceTypeParameters = ref<OrderWizardDeviceTypeParameterDTO[]>([])
const orderDeviceTypeServices = ref<OrderWizardDeviceTypeServiceDTO[]>([])
const selectedService = ref<number>(0)
const addedServices = ref<OrderWizardDeviceTypeServiceDTO[]>([])
const orderWorkers = ref<OrderWizardWorkerDTO[]>([])


orderDeviceTypes.value = await orderCreateService.getDeviceTypes()
orderDeviceTypeParameters.value = await orderCreateService.getDeviceTypeParameters(orderDeviceTypeId.value)
orderDeviceTypeServices.value = await orderCreateService.getDeviceTypeServices(orderDeviceTypeId.value)
orderWorkers.value = await orderCreateService.getWorkers()

const addedService = ref<HTMLInputElement[]>([])

const getOrderDeviceTypeParameters = async (deviceTypeId: number) => {
  orderDeviceTypeParameters.value = await orderCreateService.getDeviceTypeParameters(deviceTypeId)
}
const getOrderDeviceTypeServices = async (deviceTypeId: number) => {
  orderDeviceTypeServices.value = await orderCreateService.getDeviceTypeServices(deviceTypeId)
}
const addService = async (serviceId: number) => {
  if (!addedServices.value.find(x => x.id == serviceId) && selectedService.value > 0) {
    const s = orderDeviceTypeServices.value.find(x => x.id == serviceId) as OrderWizardDeviceTypeServiceDTO
    addedServices.value.push(s)
    await nextTick()
    addedService.value[0].focus()
    addedService.value[0].select()
  }
  selectedService.value = 0
}
const removeService = (serviceId: number) => {
  addedServices.value = addedServices.value.filter(x => x.id !== serviceId)
}
const scrollToTop = () => window.scrollTo(0, 0)
const addDevice = async () => {
  device.value.id = devices.value.length + 1
  device.value.deviceTypeId = orderDeviceTypeId.value
  device.value.parameters = orderDeviceTypeParameters.value
  device.value.services = addedServices.value

  devices.value.push(device.value)
  orderStore.setDevices(devices.value)

  device.value = new OrderWizardDeviceDTO
  orderDeviceTypeParameters.value = await orderCreateService.getDeviceTypeParameters(orderDeviceTypeId.value)
  orderDeviceTypeServices.value = await orderCreateService.getDeviceTypeServices(orderDeviceTypeId.value)
  addedServices.value = []

  scrollToTop()
  isActive.value = false
}
const removeDevice = (index: number) => {
  devices.value.splice(index, 1)

  if (devices.value.length === 0) {
    isActive.value = true
  }
}

const addToStore = () => { 
  orderStore.setDevices(devices.value)
}

</script>