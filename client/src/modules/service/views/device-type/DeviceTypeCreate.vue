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
  <DeviceTypeCreateForm />
</template>

<script setup lang="ts">
import DeviceTypeCreateForm from "@/modules/service/components/forms/device-type/DeviceTypeCreateForm.vue"

const title = 'Nowy typ urządzenia'

</script>