<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          {{ view.title }} <small class="text-muted ms-1">{{ }}</small>
        </h3>
      </div>
    </div>
    <div class="row justify-content-between">
      <div class="col-10 col-md-8 col-lg-4">
        <input type="text" class="form-control form-control-sm my-3" placeholder="Wyszukaj">
      </div>
      <!-- <div class="col-2 col-md-4 col-lg-4">
        <button
          class="btn btn-sm btn-success float-end my-3 ms-auto"
          data-bs-toggle="modal"
          data-bs-target="#CreateRoleModal"
        >
          Dodaj
        </button>
      </div> -->
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
              <!-- <tr v-if="payments.length === 0">
                <td colspan="3">
                  <div class="mb-5 pt-5 text-center text-primary">
                    <div class="spinner-border" role="status">
                      <span class="sr-only">Wczytywanie...</span>
                    </div>
                  </div>
                </td>
              </tr> -->
              <tr  v-for="payment in payments" :key="payment.id">
                <td v-if="isAdmin">test</td>
                <td>{{ ModuleHelper.getModuleName(payment.moduleId) }}</td>
                <td>{{ SubscriptionTypeHelper.getSubscriptionTypeName(payment.subscriptionType) }}</td>
                <td>{{ payment.date }}</td>
                <td>{{ payment.price.toFixed(2) }} {{ payment.currency }}</td>
                <td>
                  <div class="badge text-bg-light">
                    {{ PaymentHelper.getPaymentMethodName(payment.billing) }}
                  </div>
                </td>
                <td>
                  <span :class="`${PaymentHelper.getPaymentStatusBadgeClass(payment.status)}`">
                    {{ PaymentHelper.getPaymentStatusName(payment.status) }}
                  </span>
                </td>
                <td>
                  <a :href="'/' + payment.invoiceId" target="_blank" class="btn btn-sm btn-info">PDF</a>
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
import { useCurrentUser } from "@/store/user"
import { ModuleHelper } from "@/modules/subscription/api/helpers/ModuleHelper"
import { SubscriptionTypeHelper } from "@/modules/subscription/api/helpers/SubscriptionTypeHelper"
import { PaymentHelper } from "@/modules/subscription/api/helpers/PaymentHelper"

import { PaymentService } from "@/modules/subscription/api/services/PaymentService"
import type { PaymentDTO } from "@/modules/subscription/api/dtos/PaymentDTO"

const cols = ['Konto', 'Moduł', 'Plan', 'Data', 'Cena', 'Rozliczenie', 'Status', 'Akcje']
const view = { title: 'Historia płatności' }

const paymentService = new PaymentService()
let payments = ref(null! as PaymentDTO[])
payments.value = paymentService.getPayments()

const userStore = useCurrentUser()
const administrativeRoles = userStore.getCurrentUser.administrativeRoles
const isAdmin = administrativeRoles?.some(x => x.includes('app-admin'))

if (isAdmin === false) {
  cols.shift()
}
</script>
