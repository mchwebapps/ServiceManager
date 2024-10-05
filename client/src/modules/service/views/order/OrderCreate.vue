<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom mb-3 pb-3">
          {{ title }} <small class="text-muted ms-1">Krok {{ orderStore.getStep }}</small>
        </h3>
      </div>
    </div>
  </div>

  <OrderCreateStep1Form
    v-if="orderStore.getStep == 1"
  />
  <OrderCreateStep2Form
    v-if="orderStore.getStep == 2"
  />
  <OrderCreateStep3Form
    v-if="orderStore.getStep == 3"
  />
</template>

<script setup lang="ts">
import { useOrderCreateForm } from "@/modules/service/store/order"
import OrderCreateStep1Form from "@/modules/service/components/forms/order/create/step-1/OrderCreateStep1Form.vue"
import OrderCreateStep2Form from "@/modules/service/components/forms/order/create/step-2/OrderCreateStep2Form.vue"
import OrderCreateStep3Form from "@/modules/service/components/forms/order/create/step-3/OrderCreateStep3Form.vue"

const title = 'Nowe zlecenie naprawy'
const orderStore = useOrderCreateForm()
orderStore.$reset()

</script>