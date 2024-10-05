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
        <RouterLink :to="{ name: 'management-global-shipping-create'}" class="btn btn-sm btn-primary float-end my-3 ms-auto">Dodaj</RouterLink>
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
              <tr v-for="shippingMethod in shippingMethods" :key="shippingMethod.id">
                <td>
                  <RouterLink :to="{ name: 'management-global-shipping-view', params: { id: shippingMethod.id } }" class="text-decoration-none">
                    {{ shippingMethod.name }}
                  </RouterLink>
                </td>
                <td>
                  <button
                    class="btn btn-sm btn-danger ms-1"
                    @click="deleteShippingMethod(shippingMethod.id)"
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
import type { IShippingMethodService } from "@/modules/management/api/services/shipping-method/ShippingMethodService"
import type { ShippingMethodDTO } from "@/modules/management/api/dtos/shipping-method/ShippingMethodDTO"

const title = 'Lista sposobów wysyłki'
const cols = ['Nazwa', 'Akcje']

const shippingMethodService = container.resolve('IShippingMethodService') as IShippingMethodService
const shippingMethods = ref<ShippingMethodDTO[]>([])
shippingMethods.value = await shippingMethodService.getShippingMethods()

const refreshShippingMethods = async () => {
  shippingMethods.value = await shippingMethodService.getShippingMethods()
}

const deleteShippingMethod = (shippingId: number) => {
  try {
    Swal.fire({
      icon: 'question',
      html: 'Czy na pewno chcesz usunąć ten sposób wysyłki?',
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
          await shippingMethodService.deleteShippingMethod(shippingId)

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Sposób wysyłki usunięty',
            timer: 1000,
            showConfirmButton: false,
            showCloseButton: false,
          }).then(() => {
            refreshShippingMethods()
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