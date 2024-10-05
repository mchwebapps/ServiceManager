<template>
  <div class="container mt-5 mb-2">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          {{ title }} <small class="text-muted ms-1">{{ workPosition.name }}</small>
        </h3>
      </div>
    </div>
  </div>
  <WorkPositionEditForm :workPosition="workPosition" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"
import { container } from "tsyringe"
import type { IWorkPositionService } from "@/modules/service/api/services/work-position/WorkPositionService"
import  { WorkPositionDTO } from "@/modules/service/api/dtos/work-position/WorkPositionDTO"
import WorkPositionEditForm from "@/modules/service/components/forms/work-position/WorkPositionEditForm.vue"

const route = useRoute()
const positionId = Number(route.params.id)
const title = 'Stanowisko'

const workPositionService = container.resolve('IWorkPositionService') as IWorkPositionService
const workPosition = ref<WorkPositionDTO>(new WorkPositionDTO)
workPosition.value = await workPositionService.getWorkPosition(positionId)

</script>
