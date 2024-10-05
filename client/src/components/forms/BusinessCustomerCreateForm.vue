<template>
  <div class="container" id="business-client-form">
    <div class="row bg-light border rounded m-0 py-3 px-2">
      <div class="col-12 col-md-6 mb-3">
        <label class="form-label">NIP:</label>
        <div class="input-group">
          <input type="text" class="form-control" placeholder="Wpisz NIP" autocomplete="off" v-model="customer.taxNumber">
          <button class="btn btn-primary">Wyszukaj</button>
        </div>
      </div>
      <div class="col-12 col-md-6 mb-3">
        <label class="form-label">Firma*:</label>
        <input type="text" class="form-control" placeholder="Wpisz nazwę firmy" autocomplete="off" v-model="customer.companyName">
      </div>
      <div class="col-12 col-md-6 col-xl-3 mb-3">
        <label class="form-label">Imię:</label>
        <input type="text" class="form-control" placeholder="Wpisz imię" autocomplete="off" v-model="customer.firstName">
      </div>
      <div class="col-12 col-md-6 col-xl-3 mb-3">
        <label class="form-label">Nazwisko:</label>
        <input type="text" class="form-control" placeholder="Wpisz nazwisko" autocomplete="off" v-model="customer.lastName">
      </div>
      <div class="col-12 col-md-6 col-xl-3 mb-3">
        <label class="form-label">E-mail*:</label>
        <input type="text" class="form-control" placeholder="Wpisz e-mail" autocomplete="off" v-model="customer.email">
      </div>
      <div class="col-12 col-md-6 col-xl-3 mb-3">
        <label class="form-label">Telefon*:</label>
        <input type="text" class="form-control" placeholder="Wpisz nr telefonu" autocomplete="off" v-model="customer.phoneNumber">
      </div>
    </div>
    <hr>
    <div class="row bg-light border rounded m-0 py-3 px-2">
      <div class="col-12 col-md-12 col-lg-6 mb-3">
        <label class="form-label">Ulica*:</label>
        <div class="input-group">
          <span class="input-group-text">ul.</span>
          <input type="text" class="form-control" placeholder="Wpisz nazwę ulicy" autocomplete="off" v-model="customer.street">
        </div>
      </div>
      <div class="col-6 col-md-6 col-lg-3 mb-3">
        <label class="form-label">Nr budynku*:</label>
        <input type="text" class="form-control" placeholder="Wpisz nr domu" autocomplete="off" v-model="customer.houseNo">
      </div>
      <div class="col-6 col-md-6 col-lg-3 mb-3">
        <label class="form-label">Nr lokalu*:</label>
        <input type="text" class="form-control" placeholder="Wpisz nr mieszkania" autocomplete="off" v-model="customer.flatNo">
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-3">
        <label class="form-label">Kod pocztowy*:</label>
        <input type="text" class="form-control" placeholder="Wpisz kod pocztowy" autocomplete="off" v-model="customer.postCode">
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-3">
        <label class="form-label">Miejscowość*:</label>
        <input type="text" class="form-control" placeholder="Wpisz nazwę miejscowości" autocomplete="off" v-model="customer.city">
      </div>
      <div class="col-12 col-md-12 col-lg-4 mb-3">
        <label class="form-label">Kraj*:</label>
        <input type="text" class="form-control" placeholder="Wpisz nazwę kraju" autocomplete="off" v-model="customer.country">
      </div>
    </div>
    <hr>
    <div class="row bg-light border rounded m-0 py-3 px-2">
      <div class="col-12 mb-3">
        <label class="form-label">Nr konta:</label>
        <input type="text" class="form-control" placeholder="Wpisz nr rachunku bankowego" autocomplete="off" v-model="customer.accountNumber">
      </div>
    </div>
    <hr>
    <div class="alert bg-danger bg-opacity-10 border-danger p-3 my-10" v-if="validationErrors.length > 0">
      <AppErrorItems :errors="validationErrors" />
    </div>
    <button
      class="btn btn-primary float-end mb-5"
      :disabled="submitBtnLock"
      @click="createBusinessCustomer()"
    >
      Dodaj
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import Swal from "sweetalert2"

import { container } from "tsyringe"
import type { ICommonCustomerService } from "@/core/services/customer/CommonCustomerService"
import { CustomerCreateDTO } from "@/modules/customer/api/dtos/CustomerCreateDTO"

import { CustomerTypes } from "@/modules/customer/store/enums/StoreEnums"

import ValidationError from "@/core/errors/ValidationError"
import AppErrorItems from "@/components/AppErrorItems.vue"

const emits = defineEmits(['created'])

const customerService = container.resolve('ICommonCustomerService') as ICommonCustomerService
const customer = ref<CustomerCreateDTO>(new CustomerCreateDTO)

const submitBtnLock = ref(false)
let validationErrors = ref<{key: string, errorMessage: string}[]>([])

const createBusinessCustomer = async () => {
  try {
    submitBtnLock.value = true
    validationErrors.value = []
    customer.value.customerType = CustomerTypes.Business

    const createdCustomerId = await customerService.createCustomer(customer.value as CustomerCreateDTO)

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Klient utworzony',
      timer: 1000,
      showConfirmButton: false,
      showCloseButton: false,
    }).then(() => {
      emits('created', createdCustomerId)
      customer.value = new CustomerCreateDTO
      submitBtnLock.value = false
    })
  } catch (error: any) {
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