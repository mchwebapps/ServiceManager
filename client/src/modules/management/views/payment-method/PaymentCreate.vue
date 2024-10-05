<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom mb-3 pb-3">
          {{ title }}
        </h3>
      </div>
    </div>
  </div>
  <PaymentMethodCreateForm />
</template>

<script setup lang="ts">
import PaymentMethodCreateForm from "@/modules/management/components/forms/payment-method/PaymentMethodCreateForm.vue"

const title = 'Nowy rodzaj płatności'

</script>