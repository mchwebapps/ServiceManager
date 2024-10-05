<template>
  <div class="container mt-5 mb-2">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          {{ view.title }}
          <small class="text-muted ms-1">
            {{ order.rma }}
            <i
              class="bi bi-printer ms-2"
              data-bs-toggle="modal"
              data-bs-target="#documentModal"
              role="button"
            ></i>
          </small>
        </h3>
      </div>
    </div>
    <div class="row mt-3 justify-content-end">
      <div class="col-12">
        <!-- <button class="btn btn-sm btn-primary mb-1 me-1" data-bs-toggle="collapse" href="#invoice-collapse-form">Dane do faktury</button>
        <button class="btn btn-sm btn-outline-secondary mb-1 me-1">Faktura VAT</button>
        <button class="btn btn-sm btn-outline-secondary mb-1 me-1">Faktura Pro-Forma</button>
        <button class="btn btn-sm btn-outline-secondary mb-1">Faktura VAT Marża</button> -->
        <p class="me-5 mb-1">
          <span class="fw-semibold">Klient:</span>
          <span class="lead ms-2">
            <RouterLink
              class="text-decoration-none"
              :to="{ name: 'customer-view', params: { id: order.customerId } }"
            >
              {{ order.customerName }}
            </RouterLink>
          </span>
          <!-- <i class="bi bi-pen ms-3" data-bs-toggle="collapse" href="#customer-collapse-form" role="button"></i> -->
        </p>
      </div>
      <div class="col-12 col-xl-6">
        <p class="me-5 mb-1">
          <span class="fw-semibold">Status:</span>
          <span class="lead ms-2">{{ orderStatus.name }}</span>
        </p>
      </div>
      <div class="col-12 col-xl-6 my-2 my-xl-0">
        <div class="input-group input-group-sm">
          <select class="form-select form-select-sm" autocomplete="off" v-model="order.statusId">
            <option value="0">Zmień status na:</option>
            <option v-for="status in statuses" :key="status.id" :value="status.id">{{ status.name }}</option>
          </select>
          <div class="input-group-text user-select-none">
            <input class="form-check-input mt-0" type="checkbox" id="wyslij-email" value="email" :disabled="orderStatus.emailMessage?.length == 0">
            <label class="form-check-label px-1" for="wyslij-email">E-mail</label>
          </div>
          <div class="input-group-text user-select-none">
            <input class="form-check-input mt-0" type="checkbox" id="wyslij-sms" value="sms" :disabled="orderStatus.smsMessage?.length == 0">
            <label class="form-check-label px-1" for="wyslij-sms">SMS</label>
          </div>
          <button
            class="btn btn-success"
            @click="changeOrderStatus()">Zmień</button>
        </div>
      </div>
      <div class="col-12">
        <p class="me-5 mb-1">
          <span class="fw-semibold">Data przyjęcia:</span>
          <span class="lead ms-2">{{ order.admissionDate }}</span>
        </p>
        <p class="me-5 mb-1">
          <span class="fw-semibold">Termin realizacji:</span>
          <span class="lead ms-2">{{ order.deadline }}</span>
          <i
            class="bi bi-pen ms-3"
            data-bs-toggle="modal"
            href="#termModal"
            role="button"
          ></i>
        </p>
        <p class="me-5 mb-1">
          <span class="fw-semibold">Priorytet:</span>

          <span class="lead text-success ms-2" v-if="order.priority == 'Na spokojnie'">
            <i class="bi bi-shield-check text-success ms-2"></i>
            {{ order.priority }}
          </span>
          <span class="lead text-warning ms-2" v-if="order.priority == 'Na dziś'">
            <i class="bi bi-shield-x text-warning ms-2"></i>
            {{ order.priority }}
          </span>
          <span class="lead text-danger ms-2" v-if="order.priority == 'Na wczoraj'">
            <i class="bi bi-shield-exclamation text-danger ms-2"></i>
            {{ order.priority }}
          </span>

          <i
            class="bi bi-pen ms-3"
            data-bs-toggle="modal"
            data-bs-target="#priorityModal"
            role="button"
          ></i>
        </p>
      </div>
    </div>
  </div>
  <div class="container mt-4 d-none">
    <div class="row">
      <div class="col-12 col-lg-6 col-xxl-4">
        <!-- <div class="mb-3">
          <p class="fw-semibold mb-1">Klient:
            <RouterLink
              class="text-decoration-none"
              :to="{ name: 'customer-view', params: { id: order.customerId || ' ' } }"
            >
              <span class="lead ms-2">
                {{ order.customerName }}
              </span>
            </RouterLink>
            <i class="bi bi-pen ms-3" data-bs-toggle="collapse" href="#customer-collapse-form" role="button"></i>
          </p>
          <p class="fw-semibold mb-1">Data przyjęcia:
            <span class="lead ms-2">
              {{ order.admissionDate }}
            </span>
          </p>
          <p class="fw-semibold mb-1">Termin realizacji:
            <span class="lead ms-2">
              {{ order.deadline }}
            </span>
            <i class="bi bi-pen ms-3" data-bs-toggle="collapse" href="#terms-collapse-form" role="button"></i>
          </p>
          <p class="fw-semibold mb-1">Priorytet:
              <i class="bi bi-shield-check text-success ms-2"></i>
              <span class="lead text-success ms-2">{{ order.priority }}</span> -->
              <!-- <i class="bi bi-shield-x text-warning ms-2"></i> <span class="lead text-warning fs-6">Na dziś</span> -->
              <!-- <i class="bi bi-shield-exclamation text-danger ms-2"></i> <span class="lead text-danger fs-6">Na wczoraj</span> -->
              <!-- <i class="bi bi-pen ms-3" data-bs-toggle="collapse" href="#priority-collapse-form" role="button"></i>
          </p>
        </div> -->
      </div>
      <div class="col-12 col-lg-6 col-xxl-3">
        <!-- <p class="fw-semibold mb-1">Status:
          <span class="lead ms-2">
            {{ order.status }}
          </span>
        </p> -->
        <!-- <p class="fw-semibold mb-1">Dokument sprzedaży:
          <span class="lead ms-2">
            {{ order.salesDocument }}
          </span>
        </p>
        <p class="fw-semibold mb-1">Termin płatności:
          <span class="lead ms-2">
            {{ order.paymentTerm }}
          </span>
          <i class="bi bi-pen ms-3" data-bs-toggle="collapse" href="#terms-collapse-form" role="button"></i>
        </p>
        <p class="fw-semibold mb-1">Płatność:
          <span class="lead ms-2">
            {{ order.payment?.toFixed(2).replace('.', ',') }} zł
          </span>
          <i class="bi bi-pen ms-3" data-bs-toggle="collapse" href="#payment-collapse-form" role="button"></i>
        </p>
        <p class="fw-semibold mb-1">Dostawa:
          <span class="lead ms-2">
            {{ order.delivery }}
          </span>
          <i class="bi bi-pen ms-3" data-bs-toggle="collapse" href="#delivery-collapse-form" role="button"></i>
        </p> -->
      </div>
      <!-- <div class="col-12 col-lg-6 col-xxl-5 justify-content-center">
        <div class="input-group input-group-sm mb-3">
          <select class="form-select form-select-sm" autocomplete="off">
            <option selected>Zmień status na:</option>
            <option>Archiwum</option>
            <option>Czeka na części</option>
          </select>
          <div class="input-group-text user-select-none">
            <input class="form-check-input mt-0" type="checkbox" id="wyslij-email" value="email">
            <label class="form-check-label px-1" for="wyslij-email">E-mail</label>
          </div>
          <div class="input-group-text user-select-none">
            <input class="form-check-input mt-0" type="checkbox" id="wyslij-sms" value="sms">
            <label class="form-check-label px-1" for="wyslij-sms">SMS</label>
          </div>
          <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#nowy-klient">Zmień</button>
        </div>
        <button class="btn btn-sm btn-primary mb-1 me-1" data-bs-toggle="collapse" href="#invoice-collapse-form">Dane do faktury</button>
        <button class="btn btn-sm btn-outline-primary mb-1 me-1">Faktura VAT</button>
        <button class="btn btn-sm btn-outline-primary mb-1 me-1">Faktura Pro-Forma</button>
        <button class="btn btn-sm btn-outline-primary mb-1">Faktura VAT Marża</button>
      </div> -->
    </div>

    <!-- <div class="d-xl-inline-flex col-12">
      <p class="me-5 mb-1">
        <span class="fw-semibold">Data przyjęcia:</span>
        <span class="lead ms-2">{{ order.admissionDate }}</span>
      </p>
      <p class="me-5 mb-1">
        <span class="fw-semibold">Termin realizacji:</span>
        <span class="lead ms-2">{{ order.deadline }}</span>
      </p>
      <p class="me-5 mb-1">
        <span class="fw-semibold">Priorytet:</span>
        <i class="bi bi-shield-check text-success ms-2"></i>
        <span class="lead text-success ms-2">{{ order.priority }}</span> -->
        <!-- <i class="bi bi-shield-x text-warning ms-2"></i> <span class="lead text-warning fs-6">Na dziś</span> -->
        <!-- <i class="bi bi-shield-exclamation text-danger ms-2"></i> <span class="lead text-danger fs-6">Na wczoraj</span> -->
        <!-- <i class="bi bi-pen ms-3" data-bs-toggle="collapse" href="#priority-collapse-form" role="button"></i>
      </p>
    </div> -->

    <!-- <div class="row bg-secondary bg-opacity-10 border rounded mt-2 mx-0 mb-2 p-0">
      <div class="col-12">
        <ul class="list-group list-group-flush border rounded my-2">
          <li class="list-group-item py-1">
            <div class="d-xl-inline-flex col-12">
              <p class="me-5 mb-1">
                <span class="fw-semibold">Data przyjęcia:</span>
                <span class="lead ms-2">{{ order.admissionDate }}</span>
              </p>
              <p class="me-5 mb-1">
                <span class="fw-semibold">Termin realizacji:</span>
                <span class="lead ms-2">{{ order.deadline }}</span>
              </p>
              <p class="me-5 mb-1">
                <span class="fw-semibold">Priorytet:</span>
                <i class="bi bi-shield-check text-success ms-2"></i>
                <span class="lead text-success ms-2">{{ order.priority }}</span> -->
                <!-- <i class="bi bi-shield-x text-warning ms-2"></i> <span class="lead text-warning fs-6">Na dziś</span> -->
                <!-- <i class="bi bi-shield-exclamation text-danger ms-2"></i> <span class="lead text-danger fs-6">Na wczoraj</span> -->
                <!-- <i class="bi bi-pen ms-3" data-bs-toggle="collapse" href="#priority-collapse-form" role="button"></i>
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div> -->

    <!-- <div class="row bg-secondary bg-opacity-10 border rounded mt-2 mx-0 mb-2 p-0">
      <div class="col-12">
        <ul class="list-group list-group-flush border rounded my-2">
          <li class="list-group-item py-1">
            <div class="d-xl-inline-flex col-12">
              <p class="me-5 mb-1">
                <span class="fw-semibold">Dokument sprzedaży:</span>
                <span class="lead ms-2">{{ order.salesDocument }}</span>
              </p>
              <p class="me-5 mb-1">
                <span class="fw-semibold">Termin płatności:</span>
                <span class="lead ms-2">{{ order.paymentTerm }}</span>
                <i class="bi bi-pen ms-3" data-bs-toggle="collapse" href="#terms-collapse-form" role="button"></i>
              </p>
              <p class="me-5 mb-1">
                <span class="fw-semibold">Płatność:</span>
                <span class="lead ms-2">{{ order.payment?.toFixed(2).replace('.', ',') }} zł</span>
                <i class="bi bi-pen ms-3" data-bs-toggle="collapse" href="#payment-collapse-form" role="button"></i>
              </p>
              <p class="me-5 mb-1">
                <span class="fw-semibold">Dostawa:</span>
                <span class="lead ms-2">{{ order.delivery }}</span>
                <i class="bi bi-pen ms-3" data-bs-toggle="collapse" href="#delivery-collapse-form" role="button"></i>
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div> -->
  </div>
  <div class="container">
    <div class="row mt-3">
      <CustomerCollapse />
    </div>
  </div>
  
  <div class="container mt-5 mb-2">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          Urządzenie
          <small class="text-muted ms-2">
            {{ mainParameters.join(' ') }}
            <!-- <i class="bi bi-pen fs-5 ms-2" data-bs-toggle="collapse" href="#parameter-collapse-form" role="button"></i> -->
            <i class="bi bi-pen fs-5 ms-3" data-bs-toggle="modal" data-bs-target="#parameterModal" role="button"></i>
          </small>
        </h3>
      </div>
    </div>
    <div class="d-inline-flex" v-for="parameter in otherParameters" :key="parameter.id">
      <div class="mt-2">
        <div class="me-5 mb-1">
          <span class="fw-semibold">{{ parameter.name }}:</span>
          <span class="lead ms-2">{{ parameter.value }}</span>
        </div>
      </div>
    </div>
    <ParameterCollapse :parameters="parameters" />
  </div>

  <div class="container mt-5 mb-2">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          Usługi
          <small class="text-muted ms-1">
            <!-- <i class="bi bi-pen fs-5 ms-2" data-bs-toggle="collapse" href="#service-collapse-form" role="button"></i> -->
            <i class="bi bi-plus fs-5 ms-0" data-bs-toggle="modal" data-bs-target="#serviceCreateModal" role="button"></i>
          </small>
        </h3>
      </div>
    </div>
    <ul class="list-group">
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
        v-for="service in order.device.services" :key="service.id"
      >
        {{ service.name }}
        <button
          type="button"
          class="btn btn-warning me-2"
          data-bs-toggle="modal"
          data-bs-target="#serviceEditModal"
          @click="editService(service)"
        >
          Edytuj
        </button>
        <button
          type="button"
          class="btn btn-danger"
          @click="deleteService(service.id)"
        >
          Usuń
        </button>
      </li>
    </ul>
    <!-- <div class="d-inline-flex mt-2">
      <p class="me-4 mb-1" v-for="service in order.device.services" :key="service.id">
        <span class="fw-semibold">{{ service.name }}</span>
        
      </p>
    </div> -->
    <ServiceCollapse :services="order.device.services" />
  </div>

  <!-- <div class="container mt-5 mb-2">
    <div class="row">
      <div class="col-6">
        <h3 class="border-bottom pb-3">
          Historia naprawy
          <small class="text-muted ms-1">
            <span class="badge bg-secondary pt-1 fs-6" :class="{ 'px-2': orderHistoryCount > 9}">{{ orderHistoryCount }}</span>
            <i
              class="bi ms-2"
              :class="historyCollapseIcon"
              ref="historyCollapse"
              data-bs-toggle="collapse"
              href="#test"
              role="button"
              @click="toggleHistoryCollapseIcon()"
            ></i>
              
          </small>
        </h3>
        <div class="collapse" id="test">
          test
        </div>
      </div>
      <div class="col-6">
        <h3 class="border-bottom pb-3">
          Porady <small class="text-muted ms-1"></small>
        </h3>
      </div>
    </div>
  </div> -->

  <div class="container mt-5 mb-5">
    <div class="row">
      <div class="col-6">
        <AppAccordion :accordion="accordionHistory">
          <template #header>
            Historia zlecenia
            <span class="badge bg-primary ms-3 pt-1" :class="{ 'px-2': orderHistoryCount > 9}">
              {{ orderHistoryCount }}
            </span>
          </template>
          <HistoryAccordion :orderId="orderId" />
        </AppAccordion>
      </div>
    </div>
  </div>
  <div class="container mt-3 mb-5">
    <div class="row">
      <div class="col-12">
        <AppAccordion :accordion="accordionAdvice">
          <template #header>
            Porady
            <span class="badge bg-success ms-3 pt-1" :class="{ 'px-2': orderHistoryCount > 9}">
              {{ orderHistoryCount }}
            </span>
          </template>

          <h2>Test</h2>
        </AppAccordion>
      </div>
    </div>
  </div>

  <DeadlineModal :orderId="orderId" :term="order.deadline" @refresh="refreshOrder()" />
  <PriorityModal :orderId="orderId" :priority="order.priority" @refresh="refreshOrder()" />
  <DocumentModal :orderId="orderId" />
  <DeviceParameterModal :orderId="orderId" :parameters="parameters" />
  <DeviceServiceCreateModal :orderId="orderId" :services="services" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"

import { container } from "tsyringe"
import type { IOrderViewService } from "@/modules/service/api/services/order/OrderViewService"
import { OrderViewDTO } from "@/modules/service/api/dtos/order/view/OrderViewDTO"
import type { OrderViewDeviceParameterDTO } from "@/modules/service/api/dtos/order/view/OrderViewDeviceParameterDTO"
import { OrderViewDeviceServiceDTO } from "@/modules/service/api/dtos/order/view/OrderViewDeviceServiceDTO"

import type { IServiceStatusService } from "@/modules/service/api/services/status/ServiceStatusService"
import { ServiceStatusDTO } from "@/modules/service/api/dtos/status/ServiceStatusDTO"

import type { IParameterService } from "@/modules/service/api/services/parameter/ParameterService"
import type { ParameterValueDTO } from "@/modules/service/api/dtos/parameter-value/ParameterValueDTO"
import { ParameterCategories, ParameterTypes } from "@/modules/service/store/enums/StoreEnums"

import type { IServiceService } from "@/modules/service/api/services/service/ServiceService"
import type { ServiceDTO } from "@/modules/service/api/dtos/service/ServiceDTO"

import CustomerCollapse from "@/modules/service/components/forms/order/view/collapse/CustomerCollapse.vue"
import ParameterCollapse from "@/modules/service/components/forms/order/view/collapse/ParameterCollapse.vue"
import ServiceCollapse from "@/modules/service/components/forms/order/view/collapse/ServiceCollapse.vue"

import AppAccordion, { type IAccordion } from "@/components/AppAccordion.vue"
import HistoryAccordion from "@/modules/service/components/forms/order/view/accordion/HistoryAccordion.vue"
import DocumentModal from "@/modules/service/components/forms/order/view/modal/DocumentModal.vue"
import DeadlineModal from "@/modules/service/components/forms/order/view/modal/DeadlineModal.vue"
import PriorityModal from "@/modules/service/components/forms/order/view/modal/PriorityModal.vue"
import DeviceParameterModal from "@/modules/service/components/forms/order/view/modal/DeviceParameterModal.vue"
import DeviceServiceCreateModal from "@/modules/service/components/forms/order/view/modal/DeviceServiceCreateModal.vue"
import { OrderCreateForm } from "../../api/contracts/order/create/OrderCreateForm"

const accordionHistory = ref<IAccordion>({
  accordionId: 'accordionHistory',
  headerId: 'headingHistory',
  collapseId: 'collapseHistory',
  show: false
})
const accordionAdvice = ref<IAccordion>({
  accordionId: 'accordionAdvice',
  headerId: 'headingAdvice',
  collapseId: 'collapseAdvice',
  show: false
})
const route = useRoute()
const orderId = Number(route.params.id)
const view = ref({ title: 'Zlecenie' })

const orderViewService = container.resolve('IOrderViewService') as IOrderViewService
const statusService = container.resolve('IServiceStatusService') as IServiceStatusService
const order = ref<OrderViewDTO>(new OrderViewDTO)
const statuses = ref<ServiceStatusDTO[]>([])
const orderStatus = ref<ServiceStatusDTO>(new ServiceStatusDTO)
const parameters = ref<OrderViewDeviceParameterDTO[]>([])
const mainParameters = ref()
const otherParameters = ref()
const services = ref<OrderViewDeviceServiceDTO[]>([])
    
const serviceData = ref<OrderViewDeviceServiceDTO>(new OrderViewDeviceServiceDTO)
const editService = (service: OrderViewDeviceServiceDTO) => {
  serviceData.value = service
}
const deleteService = (serviceId: number) => { console.log(serviceId) }

order.value = await orderViewService.getOrder(orderId)
statuses.value = await statusService.getStatuses()

orderStatus.value = statuses.value.find(s => s.id === order.value.statusId) as ServiceStatusDTO
parameters.value = order.value.device.parameters
services.value = order.value.device.services

mainParameters.value = parameters.value.filter(p => p.isMain == true)
  .map(p => Array.isArray(p.values) ? p.values.find(pv => pv.id == p.value)?.text : p.value)
otherParameters.value = order.value.device.parameters.filter(x => (x.isMain == false && x.value !== ''))

const orderHistoryCount = ref<number>(1)
const historyCollapse = ref<HTMLElement>()
const historyCollapseIcon = ref('bi-plus')
const toggleHistoryCollapseIcon = () => {

}

const buttonLocked = ref<boolean>(false)

const changeOrderStatus = async () => {

}

const refreshOrder = async () => {
  order.value = await orderViewService.getOrder(orderId)
}

// orderService.getOrder(orderId).then((x) => {
//   order.value = x
//   console.log(order.value)
// })

// onMounted(async () => {
//   order.value = await orderService.getOrder(orderId)
//   console.log(order.value)
// })

// watch(
//   () => orderId,
//   async (newId) => {
//     order.value = await orderService.getOrder(newId)
//   },
//   { deep: true }
// )
</script>

<style scope>
.w-5 { width: 5% }
.w-20 { width: 20% }
.w-33 { width: 33.333333% }
</style>
