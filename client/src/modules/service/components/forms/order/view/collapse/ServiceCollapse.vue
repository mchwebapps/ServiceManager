<template>
  <div class="collapse" id="service-collapse-form">
    <div class="container-fluid p-0">
      <div class="row" v-for="service in services" :key="service.id">
        <div class="col-12">
          <hr>
          <div class="d-flex justify-content-between pt-2">
            <div class="">
              <h4>{{ service.name }}</h4>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-6 col-xl-3">
          <div class="mb-3" v-for="parameter in service.parameters" :key="parameter.id">
            <label class="form-label">{{ parameter.name }}:</label>
            <input type="text" class="form-control" autocomplete="off">
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-end mb-2">
        <button class="btn btn-sm btn-outline-primary" data-bs-toggle="collapse" href="#service-collapse-form">Zamknij</button>
        <button class="btn btn-sm btn-primary ms-2">Zapisz</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { OrderViewDeviceServiceDTO } from "@/modules/service/api/dtos/order/view/OrderViewDeviceServiceDTO"

const props = defineProps({
  services: { type: Array<OrderViewDeviceServiceDTO>, required: true }
})

const services = ref<OrderViewDeviceServiceDTO[]>([])
services.value = props.services

</script>