<template>
  <div class="container mt-5 mb-2">
    <div class="row">
      <div class="col-12">
        <h3 class="border-bottom pb-3">
          {{ title }} <small class="text-muted ms-1">{{ parameter.name }}</small>
        </h3>
      </div>
    </div>
  </div>
  <DeviceTypeParameterEditForm :parameterId="parameterId" :parameterCategory="parameterCategory" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"
import  { ParameterDTO } from "@/modules/service/api/dtos/parameter/ParameterDTO"
import { container } from "tsyringe"
import type { IParameterService } from "@/modules/service/api/services/parameter/ParameterService"
import DeviceTypeParameterEditForm from "@/modules/service/components/forms/parameter/device-type/DeviceTypeParameterEditForm.vue"

defineProps({
  parameterCategory: { type: String, required: true }
})
const title = 'Parametr'
const route = useRoute()
const parameterId = Number(route.params.id)
const parameterService = container.resolve('IParameterService') as IParameterService
const parameter = ref<ParameterDTO>(new ParameterDTO)
parameter.value = await parameterService.getParameter(parameterId)

</script>

<style scope>
.w-5 { width: 5% }
.w-20 { width: 20% }
.w-33 { width: 33.333333% }
</style>
