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
  <ServiceCreateForm />
</template>

<script setup lang="ts">
import ServiceCreateForm from "@/modules/service/components/forms/service/ServiceCreateForm.vue"

const title = 'Nowa usługa'

</script>