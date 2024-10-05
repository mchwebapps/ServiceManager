<template>
  <div class="container mt-5 mb-2">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          {{ title }} <small class="text-muted ms-1">{{ paymentMethod.name }}</small>
        </h3>
      </div>
    </div>
  </div>
  <PaymentMethodEditForm :paymentMethod="paymentMethod" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"
import { container } from "tsyringe"
import type { IPaymentMethodService } from "@/modules/management/api/services/payment-method/PaymentMethodService"
import  { PaymentMethodDTO } from "@/modules/management/api/dtos/payment-method/PaymentMethodDTO"
import PaymentMethodEditForm from "@/modules/management/components/forms/payment-method/PaymentMethodEditForm.vue"

const title = 'Rodzaj płatności'
const route = useRoute()
const paymentMethodId = Number(route.params.id)
const paymentMethodService = container.resolve('IPaymentMethodService') as IPaymentMethodService
const paymentMethod = ref<PaymentMethodDTO>(new PaymentMethodDTO)
paymentMethod.value = await paymentMethodService.getPaymentMethod(paymentMethodId)

</script>
