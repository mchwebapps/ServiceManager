<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          {{ view.title }} <small class="text-muted ms-1">{{ module.name }}</small>
        </h3>
      </div>
    </div>
    <div class="row justify-content-between">
      <div class="col-10 col-md-8 col-lg-4">
        <input type="text" class="form-control form-control-sm my-3" placeholder="Wyszukaj">
      </div>
      <div class="col-2 col-md-4 col-lg-4">
        <!-- <RouterLink :to="{ name: 'customer-create' }" class="btn btn-sm btn-primary float-end my-3 ms-auto">Dodaj</RouterLink> -->
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
              <!-- <tr v-if="subscriptions.length === 0">
                <td colspan="7">
                  <div class="mb-5 pt-5 text-center text-primary">
                    <div class="spinner-border" role="status">
                      <span class="sr-only">Wczytywanie...</span>
                    </div>
                  </div>
                </td>
              </tr> -->
              <tr v-for="subscription in subscriptions" :key="subscription.id">
                <td>
                  <RouterLink :to="{ name: 'organization', params: { organizationId: subscription.organizationId } }" class="text-decoration-none">
                    {{ subscription.organizationOwnerEmail }}
                  </RouterLink>
                </td>
                <td>{{ subscription.planName }}</td>
                <td>{{ DateHelper.formatDate(subscription.startDate!) }}</td>
                <td>{{ DateHelper.formatDate(subscription.endDate!) }}</td>
                <td>{{ DateHelper.daysDifference("2022-01-01") }}</td>
                <td>
                  {{
                      DateHelper.checkSubscriptionDates(
                        subscription.startDate!,
                        subscription.endDate!,
                        subscription.nextPaymentDate!
                      )
                  }}
                </td>
                <td>
                  <a type="button" href="#" class="btn btn-sm btn-success me-1" v-if="renewSubscriptionButton">Odnów</a>
                  <a type="button" href="#" class="btn btn-sm btn-primary me-1" v-if="changeSubscriptionButton">Zmień</a>
                  <a type="button" href="#" class="btn btn-sm btn-info" v-if="extendSubscriptionButton">Przedłuż</a>
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
import { ref, watch, onMounted } from "vue"
import { useRoute } from "vue-router"

// import subscriptions from "@/_data/subscriptions"
// import { Subscription } from "@/_data/subscriptions"
import { DateHelper } from "@/modules/subscription/api/helpers/DateHelper"
import { SubscriptionTypeHelper } from "@/modules/subscription/api/helpers/SubscriptionTypeHelper"
import { SubscriptionStatusHelper } from "@/modules/subscription/api/helpers/SubscriptionStatusHelper"
import { PaymentHelper } from "@/modules/subscription/api/helpers/PaymentHelper"

import { ModuleDTO } from "@/modules/subscription/api/dtos/ModuleDTO"
import type { ModuleSubscriptionDTO } from "@/modules/subscription/api/dtos/ModuleSubscriptionDTO"
import { container } from "tsyringe"
import type { IModuleService } from "@/modules/subscription/api/services/ModuleService"
import type { IModuleSubscriptionService } from "@/modules/subscription/api/services/ModuleSubscriptionService"
import type { IOrganizationSubscriptionService } from "@/modules/subscription/api/services/OrganizationSubscriptionService"

const cols = ref(['Klient', 'Plan', 'Start', 'Koniec', 'Pozostało', 'Status', 'Akcje'])
const view = { title: 'Lista subskrypcji' }

const route = useRoute()
const moduleKey = 'REPAIR_SERVICE' //route.params.moduleKey as string

const moduleService = container.resolve('IModuleService') as IModuleService
const moduleSubscriptionService = container.resolve('IModuleSubscriptionService') as IModuleSubscriptionService
// const subscriptionService = container.resolve('IOrganizationSubscriptionService') as IOrganizationSubscriptionService

const module = ref<ModuleDTO>(new ModuleDTO())
const subscriptions = ref<ModuleSubscriptionDTO[]>([])

let subscriptionStatus = ref()
let renewSubscriptionButton = ref<boolean>(false)
let changeSubscriptionButton = ref<boolean>(true)
let extendSubscriptionButton = ref<boolean>(false)

watch(
  () => moduleKey,
  async () => {
    subscriptions.value = await moduleSubscriptionService.getModuleSubscriptions(
      moduleKey as string
    )
    module.value = await moduleService.getModule(moduleKey)
  },
  { deep: true }
)

onMounted(async () => {
  subscriptions.value = await moduleSubscriptionService.getModuleSubscriptions(
    moduleKey as string
  )
  module.value = await moduleService.getModule(moduleKey)
})
</script>

<style scope>
w-10 { width: 10% }
w-20 { width: 20% }
</style>
