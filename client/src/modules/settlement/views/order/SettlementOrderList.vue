<template>
  <div class="container-fluid my-5">
    <div class="row">
      <div class="col-2">
        <div class="list-group">
          <a href="#" class="list-group-item list-group-item-action active" aria-current="true">
            Wszystkie
          </a>
          <a
            href="#"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            v-for="status in statuses" :key="status.id"
          >
            {{ status.name }}
            <span class="badge bg-primary rounded-pill">0</span>
          </a>
        </div>
      </div>
      <div class="col-10">
        <div class="row justify-content-between">
          <div class="col-12">
            <h3 class="border-bottom pb-3">
              {{ title }}
            </h3>
          </div>
          <div class="col-10 col-md-8 col-lg-4">
            <input type="text" class="form-control form-control-sm my-3" placeholder="Wyszukaj">
          </div>
          <div class="col-2 col-md-4 col-lg-4">
            <RouterLink :to="{ name: 'order-create'}" class="btn btn-sm btn-primary float-end my-3 ms-auto">Dodaj</RouterLink>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table table-hover text-center table-bordered align-middle fs-6">
                <thead class="bg-primary bg-opacity-10">
                  <tr>
                    <th scope="col" v-for="(col, index) in cols" :key="index">
                      {{ col }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in orders" :key="order.id">
                    <td>
                      <div class="form-check d-flex justify-content-center">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                      </div>
                    </td>
                    <td>
                      <RouterLink :to="{ name: 'order-view', params: { id: order.id } }" class="text-decoration-none">
                        {{ order.nr }}
                      </RouterLink>
                    </td>
                    <td>
                      <RouterLink :to="{ name: 'customer-view', params: { id: order.customerId } }" class="text-decoration-none">
                        {{ order.customerName }}
                      </RouterLink>
                    </td>
                    <!-- <td> ZOSTAJE
                      <span>
                        {{ order.device.parameters.filter(p => p.name == "Marka" || p.name == "Model").map(x => x.value).join(" ") }}
                      </span>
                    </td> -->
                    <td>{{ order.products.length }}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>{{ order.priceWithTax }}</td>
                    <td>
                      <RouterLink :to="{ name: 'management-global-delivery-view', params: { id: order.deliveryId } }" class="text-decoration-none">
                        {{ order.deliveryName }}
                      </RouterLink>  
                    </td>
                    <td>{{ order.date }}</td>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import Swal from "sweetalert2"

import { container } from "tsyringe"
import type { ISettlementOrderListService } from "@/modules/settlement/api/services/order/SettlementOrderListService"
import type { SettlementOrderListDTO } from "@/modules/settlement/api/dtos/order/list/SettlementOrderListDTO"

import type { ISettlementStatusService } from "@/modules/settlement/api/services/status/SettlementStatusService"
import type { SettlementStatusDTO } from "@/modules/settlement/api/dtos/status/SettlementStatusDTO"

const title ='Lista zamówień'
const cols = ['', 'Numer', 'Klient', 'Produkty', 'Ilość', 'Magazyn', 'Cena brutto', 'Rodzaj wysyłki', 'Data']

const orderService = container.resolve('ISettlementOrderListService') as ISettlementOrderListService
const statusService = container.resolve('ISettlementStatusService') as ISettlementStatusService

const orders = ref<SettlementOrderListDTO[]>([])
const parameters = ref()
const values = ref()
const statuses = ref<SettlementStatusDTO[]>([])

orders.value = await orderService.getOrders()
// parameters.value = orders.value[0].device.parameters.map(x => x.name)
// values.value = orders.value[0].device.parameters.map(x => x.value)
statuses.value = await statusService.getStatuses()


const refreshOrders = async () => {
  orders.value = await orderService.getOrders()
}


const deleteOrder = (id: number) => {
  try {
    Swal.fire({
      icon: 'question',
      html: 'Czy na pewno chcesz usunąć tę naprawę?',
      showCancelButton: true,
      cancelButtonText: 'Nie',
      cancelButtonColor: '#adb5bd', 
      showConfirmButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Tak',
      reverseButtons: true
    })
    .then(
      (result) => {
        if (result.isConfirmed) {
          // ServiceTypeService.deleteServiceType(id)

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Naprawa usunięta',
            timer: 1000,
            showConfirmButton: false,
            showCloseButton: false,
          }).then(() => {
            refreshOrders()
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