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
  <SettlementStatusCreateForm />
</template>

<script setup lang="ts">
import SettlementStatusCreateForm from "@/modules/settlement/components/forms/status/SettlementStatusCreateForm.vue"

const title = 'Nowy status'

</script>