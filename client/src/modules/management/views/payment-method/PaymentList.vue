<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          {{ title }}
        </h3>
      </div>
    </div>
    <div class="row justify-content-between">
      <div class="col-10 col-md-8 col-lg-4">
        <input type="text" class="form-control form-control-sm my-3" placeholder="Wyszukaj">
      </div>
      <div class="col-2 col-md-4 col-lg-4">
        <RouterLink :to="{ name: 'management-global-payment-create'}" class="btn btn-sm btn-primary float-end my-3 ms-auto">Dodaj</RouterLink>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="table-responsive">
          <table class="table table-hover text-center align-middle fs-6">
            <thead class="bg-primary bg-opacity-10">
              <tr>
                <th scope="col" v-for="col in cols">{{ col }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="paymentMethod in paymentMethods" :key="paymentMethod.id">
                <td>
                  <RouterLink :to="{ name: 'management-global-payment-view', params: { id: paymentMethod.id } }" class="text-decoration-none">
                    {{ paymentMethod.name }}
                  </RouterLink>
                </td>
                <td>
                  <button
                    class="btn btn-sm btn-danger ms-1"
                    @click="deletePaymentMethod(paymentMethod.id)"
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <nav aria-label="Page navigation example">
            <ul class="pagination pagination-sm justify-content-end">
              <li class="page-item disabled">
                <a class="page-link">&lt;</a>
              </li>
              <li class="page-item active"><a class="page-link" href="#">1</a></li>
              <li class="page-item"><a class="page-link" href="#">2</a></li>
              <li class="page-item"><a class="page-link" href="#">3</a></li>
              <li class="page-item">
                <a class="page-link" href="#">&gt;</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref } from "vue"
import Swal from "sweetalert2"
import { container } from "tsyringe"
import type { IPaymentMethodService } from "@/modules/management/api/services/payment-method/PaymentMethodService"
import type { PaymentMethodDTO } from "@/modules/management/api/dtos/payment-method/PaymentMethodDTO"

const title = 'Lista rodzajów płatności'
const cols = ['Nazwa', 'Akcje']

const paymentMethodService = container.resolve('IPaymentMethodService') as IPaymentMethodService
const paymentMethods = ref<PaymentMethodDTO[]>([])
paymentMethods.value = await paymentMethodService.getPaymentMethods()

const refreshPaymentMethods = async () => {
  paymentMethods.value = await paymentMethodService.getPaymentMethods()
}

const deletePaymentMethod = (paymentMethodId: number) => {
  try {
    Swal.fire({
      icon: 'question',
      html: 'Czy na pewno chcesz usunąć ten rodzaj płatności?',
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
          await paymentMethodService.deletePaymentMethod(paymentMethodId)

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Rodzaj płatności usunięty',
            timer: 1000,
            showConfirmButton: false,
            showCloseButton: false,
          }).then(() => {
            refreshPaymentMethods()
          })
        }
      }
    )
  }
  catch (error: any) {
    Swal.fire({
      title: 'Wystąpił błąd!',
      text: 'Spróbuj ponownie za chwilę.',
      icon: 'error',
      showConfirmButton: true,
    }).then(() => {
      console.log(error)
    })
  }
}

</script>