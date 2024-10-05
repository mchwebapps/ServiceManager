<template>
  <div class="container mt-5 mb-2">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          {{ title }} <small class="text-muted ms-1">{{ service.name }}</small>
        </h3>
      </div>
    </div>
  </div>
  <ServiceEditForm :serviceId="serviceId" />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { ref } from "vue"
import { container } from "tsyringe"
import type { IServiceService } from "@/modules/service/api/services/service/ServiceService"
import  { ServiceDTO } from "@/modules/service/api/dtos/service/ServiceDTO"
import ServiceEditForm from "@/modules/service/components/forms/service/ServiceEditForm.vue"

const title = 'Usługa'
const route = useRoute()
const serviceId = Number(route.params.id)
const serviceService = container.resolve('IServiceService') as IServiceService
const service = ref<ServiceDTO>(new ServiceDTO)
service.value = await serviceService.getService(serviceId)

</script>

<style scope>
.w-5 { width: 5% }
.w-20 { width: 20% }
.w-33 { width: 33.333333% }
</style>
