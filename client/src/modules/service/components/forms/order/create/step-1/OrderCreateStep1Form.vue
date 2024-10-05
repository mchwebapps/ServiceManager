<template>
  <div class="container">
    <div class="row bg-light border rounded m-0 py-3 px-2">
      <div class="col-12">
        <div class="mb-3">
          <label class="form-label">Oddział:</label>
          <select
            class="form-select"
            autocomplete="off"
            v-model="departmentId"
            @change="setDepartment()"
          >
            <option value="0">Wybierz</option>
            <option v-for="department in orderDepartments" :key="department.id" :value="department.id">
              {{ department.companyName }} - {{ department.firstName }} {{ department.lastName}} -
              {{ department.street }} {{ department.houseNo }}/{{ department.flatNo }},
              {{ department.postCode }} {{ department.city }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <hr />
    <div class="row bg-light border rounded m-0 py-3 px-2">
      <div class="col-12">
        <label class="form-label">Klient:</label>
        <div class="input-group mb-3">
          <select
            class="form-select"
            autocomplete="off"
            v-model="customerId"
            @change="setCustomer()"
          >
            <option value>Wybierz</option>
            <option
              v-for="customer in customers"
              :key="customer.id"
              :value="customer.id"
            >
              {{ customer.name }}
            </option>
          </select>
          <button
            class="btn btn-success ms-2"
            @click="createNewCustomer()"
          >
            Dodaj nowego klienta
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="container my-5" v-if="customerId, isVisible">
    <div class="row mx-2">
      <div class="col-12">
          <h4 class="border-bottom mb-3 pb-3">
            Klient
            <small class="text-muted ms-1">
              {{ selectedCustomer.name }}
            </small>
          </h4>
      </div>
    </div>
    <div class="row mx-5">
      <BillingData :customerId="orderStore.getOrder.customerId" />
      <ShippingData :customerId="orderStore.getOrder.customerId" />
      <ContactData :customerId="orderStore.getOrder.customerId" />
    </div>
  </div>
  <div class="container my-5" v-if="isNewCustomerFormActive">
    <CustomerCreate @created="refreshCustomers" />
  </div>
  <div class="container mt-3 mb-5" v-if="isVisible">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between border-top pt-3">
          <button
            class="btn btn-primary"
            :class="{ 'ms-auto': orderStore.getStep == 1 }"
            @click="orderStore.goNext(orderStore.getStep)"
          >
            Dalej
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useOrderCreateForm } from "@/modules/service/store/order"

import { container } from "tsyringe"
import type { IOrderCreateService } from "@/modules/service/api/services/order/OrderCreateService"
import type { OrderWizardDepartmentDTO } from "@/modules/service/api/dtos/order/wizard/OrderWizardDepartmentDTO"

import type { ICommonCustomerService } from "@/core/services/customer/CommonCustomerService"
import type { CommonCustomerSelectItemDTO } from "@/core/dtos/customer/CommonCustomerSelectItemDTO"

import BillingData from "@/modules/service/components/forms/order/create/step-1/BillingData.vue"
import ShippingData from "@/modules/service/components/forms/order/create/step-1/ShippingData.vue"
import ContactData from "@/modules/service/components/forms/order/create/step-1/ContactData.vue"
import CustomerCreate from "@/views/CustomerCreate.vue"

const orderStore = useOrderCreateForm()
const orderCreateService = container.resolve('IOrderCreateService') as IOrderCreateService
const orderDepartments = ref<OrderWizardDepartmentDTO[]>([])
orderDepartments.value = await orderCreateService.getDepartments()
const departmentId = ref<number>(1)

const customerId = ref(orderStore.getOrder.customerId)

const customerService = container.resolve('ICommonCustomerService') as ICommonCustomerService
const customers = ref<CommonCustomerSelectItemDTO[]>([])
customers.value = await customerService.getCustomersForSelectOptions()

const isNewCustomerFormActive = ref<boolean>(false)
const isVisible = (orderStore.getOrder.customerId) ? ref<boolean>(true) : ref<boolean>(false)
const selectedCustomer = ref()

if (customerId.value !== '') {
  selectedCustomer.value = await customerService.getCustomer(orderStore.getOrder.customerId)
}

const setDepartment = async () => {
  await orderStore.setDepartmentId(departmentId.value)
}
const createNewCustomer = () => {
  customerId.value = ''
  isNewCustomerFormActive.value = true
  isVisible.value = false
}
const setCustomer = async () => {
  if (customerId.value !== '') {
    isVisible.value = true
    isNewCustomerFormActive.value = false
    await orderStore.setCustomerId(customerId.value)
  } else {
    isVisible.value = false
    console.log(orderStore.getOrder.customerBillingId)
    await orderStore.setCustomerId('')
  }
}
const refreshCustomers = async (createdCustomerId: string) => {
  customers.value = await customerService.getCustomersForSelectOptions()
  customerId.value = createdCustomerId
  setCustomer()
}

watch(
  () => orderStore.getOrder.customerId,
  (newId) => {
    selectedCustomer.value = customers.value.find(c => c.id == newId)
  },
  { deep: true }
)

</script>