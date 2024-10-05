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
  <ShippingMethodCreateForm />
</template>

<script setup lang="ts">
import ShippingMethodCreateForm from "@/modules/management/components/forms/shipping-method/ShippingMethodCreateForm.vue"

const title = 'Nowy sposób wysyłki'

</script>