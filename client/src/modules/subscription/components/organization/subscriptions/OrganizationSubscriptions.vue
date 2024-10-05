<template>
  <!-- <div class="mb-5 pt-5 text-center text-primary" v-if="!subscriptions">
    <div class="spinner-border" role="status">
      <span class="sr-only">Wczytywanie...</span>
    </div>
  </div> -->
  <!-- v-else-if="subscriptions.length !== 0" -->
  <div class="row">
    <div class="col-12 mt-3">
      <label class="form-label">
        <h5>
          {{ component.title }}:
        </h5>
      </label>
      <div class="table-responsive">
        <table class="table table-hover text-center align-middle fs-6">
          <thead class="bg-primary bg-opacity-10">
            <tr>
              <th class="min-w-150px">Moduł</th>
              <th class="min-w-125px">Subskrypcja</th>
              <th class="min-w-125px">Start</th>
              <th class="min-w-125px">Koniec</th>
              <th class="min-w-125px">Pozostało</th>
              <th class="min-w-125px">Status</th>
              <th class="min-w-70px">Opcje</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="subscription in subscriptions" :key="subscription.id">
              <td class="text-danger fw-bold">brak</td>
              <td>
                <label class="w-125px">{{ subscription.planName }}</label>
              </td>
              <td>{{ DateHelper.formatDate(subscription.startDate) }}</td>
              <td>{{ DateHelper.formatDate(subscription.endDate) }}</td>
              <td>{{ DateHelper.daysDifference(subscription.endDate) }}</td>
              <td class="text-danger fw-bold">brak</td>
              <td class="text-end">
                <a
                  type="button"
                  href="#"
                  class="btn btn-sm btn-danger"
                >
                  <s>Ulepsz plan</s>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <hr>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { DateHelper } from "@/modules/subscription/api/helpers/DateHelper"
import type { OrganizationSubscriptionDTO } from "@/modules/subscription/api/dtos/OrganizationSubscriptionDTO"
import { container } from "tsyringe"
import type { IOrganizationSubscriptionService } from "@/modules/subscription/api/services/OrganizationSubscriptionService"

const props = defineProps({
  'organizationId': { type: String, required: true }
})

const component = ref({
  title: 'Aktywne subskrypcje',
  btnEditText: 'Edytuj',
  btnNewText: 'Dodaj',
  newDataModal: '#',
  editDataModal: '#'
})

const subscriptionService = container.resolve('IOrganizationSubscriptionService') as IOrganizationSubscriptionService
const subscriptions = ref<OrganizationSubscriptionDTO[]>([])

watch(
  () => props.organizationId,
  async (newId) => {
    subscriptions.value = await subscriptionService.getOrganizationSubscriptions(newId)
  },
  { deep: true }
)

if (props.organizationId) {
  subscriptionService.getOrganizationSubscriptions(props.organizationId).then(
    os => subscriptions.value = os
  )
}
</script>
