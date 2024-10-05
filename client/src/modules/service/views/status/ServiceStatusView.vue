<template>
  <div class="container mt-5 mb-2">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          {{ title }} <small class="text-muted ms-1">{{ status.name }}</small>
        </h3>
      </div>
    </div>
  </div>
  <ServiceStatusEditForm :status="status" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"
import { container } from "tsyringe"
import type { IServiceStatusService } from "@/modules/service/api/services/status/ServiceStatusService"
import  { ServiceStatusDTO } from "@/modules/service/api/dtos/status/ServiceStatusDTO"
import ServiceStatusEditForm from "@/modules/service/components/forms/status/ServiceStatusEditForm.vue"

const title = 'Status'
const route = useRoute()
const statusId = Number(route.params.id)
const statusService = container.resolve('IServiceStatusService') as IServiceStatusService
const status = ref<ServiceStatusDTO>(new ServiceStatusDTO)
status.value = await statusService.getStatus(statusId)

</script>

<style scope>
.w-5 { width: 5% }
.w-20 { width: 20% }
.w-33 { width: 33.333333% }
</style>
