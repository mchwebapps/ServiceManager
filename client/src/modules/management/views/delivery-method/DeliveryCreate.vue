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
  <DeliveryMethodCreateForm />
</template>

<script setup lang="ts">
import DeliveryMethodCreateForm from "@/modules/management/components/forms/delivery-method/DeliveryMethodCreateForm.vue"

const title = 'Nowy sposób dostawy'

</script>