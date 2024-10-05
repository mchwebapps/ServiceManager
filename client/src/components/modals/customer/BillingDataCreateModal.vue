<template>
  <AppModal :modal="modal.settings" :errors="validationErrors">

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
        <div class="col-12 col-xl-4 mb-3">
          <label for="companyName" class="form-label">Firma:</label>
          <input type="text" class="form-control" id="companyName" placeholder="Wpisz nazwę firmy" v-model="billing.companyName">
        </div>
        <div class="col-12 col-lg-6 col-xl-4 mb-3">
          <label for="firstName" class="form-label">Imię:</label>
          <input type="text" class="form-control" id="firstName" placeholder="Wpisz imię" v-model="billing.firstName">
        </div>
        <div class="col-12 col-lg-6 col-xl-4 mb-3">
          <label for="lastName" class="form-label">Nazwisko:</label>
          <input type="text" class="form-control" id="lastName" placeholder="Wpisz nazwisko" v-model="billing.lastName">
        </div>
        <div class="col-12 col-xl-6 mb-3">
          <label for="companyStreet" class="form-label">Ulica:</label>
          <div class="input-group">
            <span class="input-group-text">ul.</span>
            <input type="text" class="form-control" id="companyStreet" placeholder="Wpisz nazwę ulicy" v-model="billing.street">
          </div>
        </div>
        <div class="col-12 col-lg-6 col-xl-3 mb-3">
          <label for="companyBuildingNo" class="form-label">Nr budynku:</label>
          <input type="text" class="form-control" id="companyBuildingNo" placeholder="Wpisz nr budynku/domu" v-model="billing.houseNo">
        </div>
        <div class="col-12 col-lg-6 col-xl-3 mb-3">
          <label for="companyHouseNo" class="form-label">Nr lokalu:</label>
          <input type="text" class="form-control" id="companyHouseNo" placeholder="Wpisz nr lokalu/mieszkania" v-model="billing.flatNo">
        </div>
        <div class="col-12 col-lg-4 col-xl-4 mb-3">
          <label for="companyPostcode" class="form-label">Kod pocztowy:</label>
          <input type="text" class="form-control" id="companyPostcode" placeholder="Wpisz kod pocztowy" v-model="billing.postCode">
        </div>
        <div class="col-12 col-lg-4 col-xl-4 mb-3">
          <label for="companyCity" class="form-label">Miejscowość:</label>
          <input type="text" class="form-control" id="companyCity" placeholder="Wpisz nazwę miejscowości" v-model="billing.city">
        </div>
        <div class="col-12 col-lg-4 col-xl-4 mb-3">
          <label for="companyCountry" class="form-label">Kraj:</label>
          <input type="text" class="form-control" id="companyCountry" placeholder="Wpisz nazwę kraju" v-model="billing.country">
        </div>
        <div class="col-12 mb-3">
          <label for="companyBankAccount" class="form-label">Nr konta:</label>
          <input type="text" class="form-control" id="companyBankAccount" placeholder="Wpisz nr rachunku bankowego" v-model="billing.accountNumber">
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
        @click="createBilling()"
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
import { ref } from "vue"
import Swal from "sweetalert2"
import { Modal } from "bootstrap"
import AppModal, { type IModal } from "@/components/AppModal.vue"
import { CommonCustomerBillingDTO } from "@/core/dtos/customer/CommonCustomerBillingDTO"
import { container } from "tsyringe"
import type { ICommonCustomerBillingService } from "@/core/services/customer/CommonCustomerBillingService"
import AppErrorItems from "@/components/AppErrorItems.vue"
import ValidationError from "@/core/errors/ValidationError"

const props = defineProps({
  customerId: { type: String, required: true}
})
const emits = defineEmits(['refresh'])
const modal = ref<IModal>({
  settings: {
    id: '#BillingDataCreateModal',
    size: 'modal-xl',
    backdrop: true,
    keyboard: true,
    title: 'Dane do faktury',
    subtitle: 'Nowe dane',
    color: 'success',
  },
  btnText: 'Dodaj',
  btnLock: false
})
let validationErrors = ref<{key: string, errorMessage: string}[]>([])

const billingService = container.resolve('ICommonCustomerBillingService') as ICommonCustomerBillingService
const billing = ref<CommonCustomerBillingDTO>(new CommonCustomerBillingDTO)

const reset = () => {
  setTimeout(() => {
    billing.value = new CommonCustomerBillingDTO
  }, 500)
}

const createBilling = async () => {

  try {
    modal.value.btnLock = true
    validationErrors.value = []

    await billingService.createCustomerBilling(
      props.customerId,
      billing.value
    )
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Dane utworzone",
      timer: 1000,
      showConfirmButton: false,
      showCloseButton: false,
    }).then(() => {
      Modal.getInstance(modal.value.settings.id)?.hide()
      setTimeout(() => modal.value.btnLock = false, 1500)
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