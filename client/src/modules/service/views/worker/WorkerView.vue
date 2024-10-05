<template>
  <div class="container mt-5 mb-2">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          {{ title }} <small class="text-muted ms-1">{{ worker.firstName }} {{ worker.lastName }}</small>
        </h3>
      </div>
    </div>
  </div>
  <WorkerEditForm :worker="worker" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"
import { container } from "tsyringe"
import type { IWorkerService } from "@/modules/service/api/services/worker/WorkerService"
import  { WorkerDTO } from "@/modules/service/api/dtos/worker/WorkerDTO"
import WorkerEditForm from "@/modules/service/components/forms/worker/WorkerEditForm.vue"

const title = 'Pracownik'
const route = useRoute()
const workerId = Number(route.params.id)
const workerService = container.resolve('IWorkerService') as IWorkerService
const worker = ref<WorkerDTO>(new WorkerDTO)
worker.value = await workerService.getWorker(workerId)

</script>

<style scope>
.w-5 { width: 5% }
.w-20 { width: 20% }
.w-33 { width: 33.333333% }
</style>
