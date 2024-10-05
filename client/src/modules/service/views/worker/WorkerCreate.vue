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
  <WorkerCreateForm />
</template>

<script setup lang="ts">
import WorkerCreateForm from "@/modules/service/components/forms/worker/WorkerCreateForm.vue"

const title = 'Nowy pracownik'

</script>