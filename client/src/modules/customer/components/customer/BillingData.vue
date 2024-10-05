<template>
  <div class="row">
    <div class="col-12 mt-3">
      <label class="form-label">
        <h5>
          {{ component.title }}:
          <button class="btn btn-sm btn-success ms-2" data-bs-toggle="modal" :data-bs-target="component.newDataModal">
            {{ component.btnText }}
          </button>
        </h5>
      </label>
      <div class="table-responsive">
        <table class="table table-borderless align-middle">
          <tbody>
            <tr v-for="billing in billings" :key="billing.id">
              <td class="w-5">
                <input
                  type="radio"
                  class="form-check-input"
                  :id="'mainBilling' + billing.id"
                  name="mainBilling"
                  autocomplete="off"
                  role="button"
                  :checked="billing.isMain"
                  @click="setBilling(billing.id)"
                >
              </td>
              <td>
                <label :for="'mainBilling' + billing.id" role="button">
                  <b class="me-md-2" v-if="billing.companyName">{{ billing.companyName }}</b>
                  <span class="d-block d-md-inline">
                    <i class="bi bi-house ms-0 ms-md-4 me-1"></i> ul. {{ billing.street }} {{ billing.houseNo }} m. {{ billing.flatNo }},
                    {{ billing.postCode }} {{ billing.city }}
                  </span>
                  <span class="d-block" v-if="billing.accountNumber">
                    <i class="bi bi-bank ms-0 me-1"></i> {{ billing.accountNumber }}
                  </span>
                </label>
              </td>
              <td class="w-20 text-center text-md-end">
                <button
                  class="btn btn-sm btn-warning"
                  data-bs-toggle="modal"
                  :data-bs-target="component.editDataModal"
                  @click="editBilling(billing.id)"
                >
                  Edytuj
                </button>
                <button
                  class="btn btn-sm btn-danger mt-2 mt-md-0 ms-md-2"
                  @click="deleteBilling(billing.id)"
                >
                  Usuń
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <hr>
  <BillingDataCreateModal :customerId="customerId" @refresh="refreshBillings()" />
  <BillingDataEditModal :customerId="customerId" :billing="billing" @refresh="refreshBillings()" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Swal from 'sweetalert2'
import { CommonCustomerBillingDTO } from '@/core/dtos/customer/CommonCustomerBillingDTO'
import { container } from 'tsyringe'
import type { ICommonCustomerBillingService } from '@/core/services/customer/CommonCustomerBillingService'
import BillingDataCreateModal from '@/components/modals/customer/BillingDataCreateModal.vue'
import BillingDataEditModal from '@/components/modals/customer/BillingDataEditModal.vue'
import ValidationError from '@/core/errors/ValidationError'

const props = defineProps({
  customerId: { type: String, required: true }
})
const component = ref({
  title: 'Dane do faktury',
  btnText: 'Dodaj',
  newDataModal: '#BillingDataCreateModal',
  editDataModal: '#BillingDataEditModal'
})
let validationErrors = ref<{key: string, errorMessage: string}[]>([])

const billingService = container.resolve('ICommonCustomerBillingService') as ICommonCustomerBillingService

const billings = ref<CommonCustomerBillingDTO[]>([])
const billing = ref<CommonCustomerBillingDTO>(new CommonCustomerBillingDTO)


billings.value = await billingService.getCustomerBillings(props.customerId)


const refreshBillings = async () => {
  billings.value = await billingService.getCustomerBillings(props.customerId)
}


const editBilling = async (billingId: number) => {
  billing.value = await billingService.getCustomerBilling(props.customerId, billingId)
}


const setBilling = async (billingId: number, data: boolean = true) => {
  try {
    await billingService.setCustomerBilling(
    props.customerId,
    billingId,
    data
  )
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: "Dane ustawione",
    timer: 1000,
    showConfirmButton: false,
    showCloseButton: false,
  })
} catch (error: any) {
    if (error instanceof ValidationError) {
      validationErrors.value = Object.keys(error.Errors).map(key => {
        const arr = error.Errors[key] as []
        return { key,errorMessage:arr.join(',') }
      })
      return
    }
    Swal.fire({
      title: 'Błąd serwera!',
      html: 'Sprawdź szczegółowe komunikaty lub odśwież stronę i spróbuj ponownie.',
      icon: 'error',
      showConfirmButton: true,
    })
  }
}


const deleteBilling = (billingId: number) => {
  try {
    Swal.fire({
      icon: 'question',
      html: 'Czy na pewno chcesz usunąć te dane?',
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
          await billingService.deleteCustomerBilling(props.customerId, billingId)

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Dane usunięte',
            timer: 1500,
            showConfirmButton: false,
            showCloseButton: false,
          })
          refreshBillings()
        }
      }
    )
  } catch (error: any) {
      if (error instanceof ValidationError) {
        validationErrors.value = Object.keys(error.Errors).map(key => {
          const arr = error.Errors[key] as []
          return { key,errorMessage:arr.join(',') }
        })
        return
      }
      Swal.fire({
        title: 'Błąd serwera!',
        html: 'Sprawdź szczegółowe komunikaty lub odśwież stronę i spróbuj ponownie.',
        icon: 'error',
        showConfirmButton: true,
      })
    }
}
</script>