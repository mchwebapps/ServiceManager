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
  <WorkPositionCreateForm />
</template>

<script setup lang="ts">
import WorkPositionCreateForm from "@/modules/service/components/forms/work-position/WorkPositionCreateForm.vue"

const title = 'Nowe stanowisko'

</script>