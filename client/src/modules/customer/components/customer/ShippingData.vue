<template>
  <div class="row">
    <div class="col-12 mt-3">
      <label class="form-label">
        <h5>
          {{ component.title }}
          <button class="btn btn-sm btn-success ms-2" data-bs-toggle="modal" :data-bs-target="component.newDataModal">
            {{ component.btnValue }}
          </button>
        </h5>
      </label>
      <div class="table-responsive">
        <table class="table table-borderless align-middle">
          <tbody>
            <tr v-for="shipping in shippings" :key="shipping.id">
              <td class="w-5">
                <input
                  type="radio"
                  class="form-check-input"
                  :id="'mainShipping' + shipping.id"
                  name="mainShipping"
                  autocomplete="off"
                  role="button"
                  :checked="shipping.isMain"
                  @click="setShipping(shipping.id)"
                >
              </td>
              <td>
                <label :for="'mainShipping' + shipping.id" role="button">
                  <b class="me-md-2" v-if="shipping.companyName">{{ shipping.companyName }}</b>
                  <span class="d-block d-md-inline">
                    <i class="bi bi-house ms-0 ms-md-4 me-1"></i> ul. {{ shipping.street }} {{ shipping.houseNo }} m. {{ shipping.flatNo }},
                    {{ shipping.postCode }} {{ shipping.city }}
                  </span>
                  <span class="d-block">
                    <span class="text-primary">{{ shipping.firstName }} {{ shipping.lastName }}</span>
                    <span class="d-block d-md-inline" v-if="shipping.phoneNumber">
                      <i class="bi bi-telephone ms-0 ms-md-4 me-0"></i> {{ shipping.phoneNumber }}
                    </span>
                    <span class="d-block d-md-inline" v-if="shipping.email">
                      <i class="bi bi-envelope ms-0 ms-md-4 me-1"></i> {{ shipping.email }}
                    </span>
                    <!-- <span class="text-primary">{{ shipping.firstName }} {{ shipping.lastName }}</span> -
                    {{ shipping.phoneNumber }} - {{ shipping.email }} -->
                  </span>
                </label>
              </td>
              <td class="w-20 text-center text-md-end">
                <button class="btn btn-sm btn-warning" data-bs-toggle="modal" :data-bs-target="component.editDataModal"
                  @click="editShipping(shipping.id)">
                  Edytuj
                </button>
                <button class="btn btn-sm btn-danger mt-2 mt-md-0 ms-md-2"
                  @click="deleteShipping(shipping.id)">Usuń</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <hr>
  <ShippingDataCreateModal :customerId="customerId" @refresh="refreshShippings()" />
  <ShippingDataEditModal :customerId="customerId" :shipping="shipping" @refresh="refreshShippings()" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Swal from 'sweetalert2'
import { CommonCustomerShippingDTO } from '@/core/dtos/customer/CommonCustomerShippingDTO'
import { container } from 'tsyringe'
import type { ICommonCustomerShippingService } from '@/core/services/customer/CommonCustomerShippingService'
import ShippingDataCreateModal from '@/components/modals/customer/ShippingDataCreateModal.vue'
import ShippingDataEditModal from '@/components/modals/customer/ShippingDataEditModal.vue'
import ValidationError from '@/core/errors/ValidationError'

const props = defineProps({
  customerId: { type: String, required: true }
})
const component = ref({
  title: 'Dane do wysyłki:',
  btnValue: 'Dodaj',
  newDataModal: '#ShippingDataCreateModal',
  editDataModal: '#ShippingDataEditModal'
})
let validationErrors = ref<{key: string, errorMessage: string}[]>([])

const shippingService = container.resolve('ICommonCustomerShippingService') as ICommonCustomerShippingService

const shippings = ref<CommonCustomerShippingDTO[]>([])
const shipping = ref<CommonCustomerShippingDTO>(new CommonCustomerShippingDTO)

shippings.value = await shippingService.getCustomerShippings(props.customerId)


const refreshShippings = async () => {
  shippings.value = await shippingService.getCustomerShippings(props.customerId)
}


const editShipping = async (shippingId: number) => {
  shipping.value = await shippingService.getCustomerShipping(props.customerId, shippingId)
}


const setShipping = async (shippingId: number, data: boolean = true) => {
  try {
    await shippingService.setCustomerShipping(
    props.customerId,
    shippingId,
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


const deleteShipping = (shippingId: number) => {
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
          await shippingService.deleteCustomerShipping(props.customerId, shippingId)

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Dane usunięte',
            timer: 1500,
            showConfirmButton: false,
            showCloseButton: false,
          })
          refreshShippings()
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
